import { createQuery } from '@tanstack/svelte-query';
import { getProfileData } from '@/api/getProfileData';

export const useGetProfileData = () => {
	const query = createQuery({
		queryKey: ['profile-data'],
		queryFn: () => getProfileData()
	});
	return query;
};
