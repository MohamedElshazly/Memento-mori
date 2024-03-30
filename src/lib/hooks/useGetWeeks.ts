import { supabase } from '@/SupabaseClient';
import { createQuery } from '@tanstack/svelte-query';
import type { Weeks } from '../../global.types';

export const useGetWeeks = (userId: string) => {
	const query = createQuery({
		queryKey: ['weeks-data'],
		queryFn: async () =>
			await supabase
				.from('weeks')
				.select('week_id, checked')
				.eq('user_id', userId)
				.order('week_id', { ascending: true })
				.returns<Weeks[]>()
	});
	return query;
};
