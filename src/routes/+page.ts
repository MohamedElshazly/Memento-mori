import { toString } from 'lodash-es';
import type { Profile, Weeks } from '../global.types';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ data, parent }) => {
	const { queryClient, supabase, session } = await parent();
	const userId = session?.user?.id;

	await queryClient.prefetchQuery({
		queryKey: ['profile-data'],
		queryFn: async () =>
			await supabase.from('profiles').select('calendar_initialized, dob').returns<Profile[]>()
	});
	await queryClient.prefetchQuery({
		queryKey: ['weeks-data'],
		queryFn: async () =>
			await supabase
				.from('weeks')
				.select('week_id, checked')
				.eq('user_id', toString(userId))
				.order('week_id', { ascending: true })
				.returns<Weeks[]>()
	});

	return {
		...data
	};
};
