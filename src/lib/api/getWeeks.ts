import { supabase } from '@/SupabaseClient';
import type { Weeks } from '../../global.types';

export const getWeeks = async (userId: string) => {
	return await supabase
		.from('weeks')
		.select('week_id, checked')
		.eq('user_id', userId)
		.order('week_id', { ascending: true })
		.returns<Weeks[]>();
};
