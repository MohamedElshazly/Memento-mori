import { formSchema } from '@/components/Birth.svelte';
import { fail, type Actions } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

export const load = async ({ locals }) => {
	const { supabase } = locals;

	const { data: calendarStatus, error } = await supabase
		.from('profiles')
		.select('calendar_initialized');

	if (error) {
		console.error('error', error);
	}

	return {
		calendarStatus: calendarStatus?.[0].calendar_initialized,
		form: await superValidate(zod(formSchema))
	};
};

export const actions: Actions = {
	default: async (event) => {
		const session = await event?.locals?.getSession();
		const { supabase } = event?.locals || {};
		const form = await superValidate(event, zod(formSchema));
		if (!form.valid) {
			return fail(400, {
				form
			});
		}

		await supabase
			.from('profiles')
			.update({ calendar_initialized: true })
			.eq('id', session?.user?.id);

		return {
			form
		};
	}
};
