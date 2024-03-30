import { supabase } from '@/SupabaseClient';
import type { Weeks } from '../../global.types';

export const CellOperations = () => {
	const getSession = async () => {
		return (await supabase.auth.getSession()).data.session;
	};
	const onCellCheck = async (week_id: number, week?: Weeks) => {
		const session = await getSession();
		if (!session) return;

		if (week && week.checked) {
			await supabase
				.from('weeks')
				.update({ week_id, checked: false, user_id: session.user?.id })
				.eq('week_id', week_id);

			return;
		}
		if (week && !week.checked) {
			await supabase
				.from('weeks')
				.update({ week_id, checked: true, user_id: session.user?.id })
				.eq('week_id', week_id);

			return;
		}

		await supabase.from('weeks').insert([{ week_id, user_id: session.user?.id, checked: true }]);
	};

	return {
		onCellCheck
	};
};
