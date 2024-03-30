import { createQuery } from '@tanstack/svelte-query';

import { getWeeks } from '@/api/getWeeks';

export const useGetWeeks = (userId: string) => {
	const query = createQuery({
		queryKey: ['weeks-data'],
		queryFn: () => getWeeks(userId)
	});
	return query;
};
