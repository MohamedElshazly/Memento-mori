import { supabase } from '@/SupabaseClient';
import { createQuery } from '@tanstack/svelte-query';
import type { Profile } from '../../global.types';

export const useGetProfileData = () => {
	const query = createQuery({
		queryKey: ['profile-data'],
		queryFn: async () =>
			await supabase.from('profiles').select('calendar_initialized, dob').returns<Profile[]>()
	});
	return query;
};
