// src/hooks.server.ts
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
import { createServerClient } from '@supabase/ssr';
import { type Handle, redirect, error } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';

const openRoutes = ['/auth/login', '/auth/callback'];

const supabase: Handle = async ({ event, resolve }) => {
	event.locals.supabase = createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
		cookies: {
			get: (key) => event.cookies.get(key),
			/**
			 * Note: You have to add the `path` variable to the
			 * set and remove method due to sveltekit's cookie API
			 * requiring this to be set, setting the path to `/`
			 * will replicate previous/standard behaviour (https://kit.svelte.dev/docs/types#public-types-cookies)
			 */
			set: (key, value, options) => {
				event.cookies.set(key, value, { ...options, path: '/' });
			},
			remove: (key, options) => {
				event.cookies.delete(key, { ...options, path: '/' });
			}
		}
	});

	/**
	 * A convenience helper so we can just call await getSession() instead const { data: { session } } = await supabase.auth.getSession()
	 */
	event.locals.getSession = async () => {
		const {
			data: { session }
		} = await event.locals.supabase.auth.getSession();
		return session;
	};

	return resolve(event, {
		filterSerializedResponseHeaders(name) {
			return name === 'content-range';
		}
	});
};
const authorization: Handle = async ({ event, resolve }) => {
	if (openRoutes.includes(event.url.pathname) && event.request.method === 'GET') {
		const session = await event.locals.getSession();
		if (session) {
			// the user is not signed in
			redirect(303, '/');
		}
	}
	// protect requests to all routes that start with /protected-routes
	if (!openRoutes.includes(event.url.pathname) && event.request.method === 'GET') {
		const session = await event.locals.getSession();
		if (!session) {
			// the user is not signed in
			redirect(303, '/auth/login');
		}
	}

	// protect POST requests to all routes that start with /protected-posts
	if (!openRoutes.includes(event.url.pathname) && event.request.method === 'POST') {
		const session = await event.locals.getSession();
		if (!session) {
			// the user is not signed in
			throw error(303, '/auth/login');
		}
	}

	return resolve(event);
};

export const handle: Handle = sequence(supabase, authorization);
