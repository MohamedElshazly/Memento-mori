import { supabase } from '@/SupabaseClient';
import type { Weeks } from '../../global.types';
import { queryClientStore } from '@/queryClientStore';
import type { QueryClient } from '@tanstack/svelte-query';

export const CellOperations = () => {
	const getSession = async () => {
		return (await supabase.auth.getSession()).data.session;
	};
	let queryClient: QueryClient;

	queryClientStore.subscribe((value) => (queryClient = value));
	const onCellCheck = async (week_id: number, week?: Weeks) => {
		const session = await getSession();

		if (!session) return;

		if (week && week.checked) {
			await supabase
				.from('weeks')
				.update({ week_id, checked: false, user_id: session.user?.id })
				.eq('week_id', week_id);
			queryClient.invalidateQueries({
				exact: true,
				queryKey: ['weeks-data'],
				refetchType: 'all'
			});
			return;
		}
		if (week && !week.checked) {
			await supabase
				.from('weeks')
				.update({ week_id, checked: true, user_id: session.user?.id })
				.eq('week_id', week_id);
			queryClient.invalidateQueries({
				exact: true,
				queryKey: ['weeks-data'],
				refetchType: 'all'
			});
			return;
		}

		await supabase.from('weeks').insert([{ week_id, user_id: session.user?.id, checked: true }]);

		queryClient.invalidateQueries({
			exact: true,
			queryKey: ['weeks-data'],
			refetchType: 'all'
		});
	};

	return {
		onCellCheck
	};
};
