import { createBrowserClient } from '@supabase/ssr';
import type { Database } from '../schema';
import { PUBLIC_SUPABASE_ANON_KEY, PUBLIC_SUPABASE_URL } from '$env/static/public';

export const supabase = createBrowserClient<Database>(
	PUBLIC_SUPABASE_URL,
	PUBLIC_SUPABASE_ANON_KEY,
	{
		global: {
			fetch
		},
		cookies: {}
	}
);
