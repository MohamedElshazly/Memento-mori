import { supabase } from '@/SupabaseClient';
import type { Profile } from '../../global.types';

export const getProfileData = async () => {
	return await supabase.from('profiles').select('calendar_initialized, dob').returns<Profile[]>();
};
