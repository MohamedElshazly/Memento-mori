<script lang="ts">
	import Cell from '@/components/Cell.svelte';
	import Birth from '@/components/Birth.svelte';

	import type { Profile, Weeks } from '../global.types.js';

	import { useGetProfileData } from '@/hooks/useGetProfileData.js';
	import { differenceInWeeks } from 'date-fns';
	import { queryClientStore } from '@/queryClientStore.js';
	import { useGetWeeks } from '@/hooks/useGetWeeks.js';
	import { toString } from 'lodash-es';

	export let data;
	let { session } = data;
	$: ({ session } = data);

	const noOfWeeks = 3840;
	const profileStore = useGetProfileData();
	const weeksStore = useGetWeeks(toString(session?.user?.id));

	const { data: profileData, isLoading: isLoadingProfileData } = $profileStore;
	const { data: weeksData, isLoading: isLoadingWeeksData } = $weeksStore;

	const { calendar_initialized, dob } = profileData?.data?.[0] as Profile;
	const weeks = weeksData?.data as Weeks[];

	const noWeeksSinceDOB = weeks?.length || 0;
	const currentWeek = differenceInWeeks(new Date(), new Date(dob as string));
	const calendarStatus = calendar_initialized;

	const loading = isLoadingProfileData || isLoadingWeeksData;
</script>

{#key weeks}
	{#if loading}
		<div>loading</div>
	{/if}
	{#if calendarStatus}
		<div class="mt-10 flex flex-col items-center justify-center gap-10">
			<div class="flex flex-col items-center justify-center gap-2">
				<h1 class="text-2xl font-bold">Memento Mori</h1>
				<p class="text-center italic">
					"Let us prepare our minds as if we’d come to the very end of life. Let us postpone
					nothing."
				</p>
				<p class="self-end">-Seneca</p>
			</div>
			<div class="grid gap-2" style="grid-template-columns: repeat(24, minmax(0, 1fr));">
				{#each Array(noOfWeeks) as _, i}
					{#if i < noWeeksSinceDOB}
						<Cell week={weeks?.[i]} {currentWeek} />
					{:else}
						<Cell idx={i + 1} {currentWeek} />
					{/if}
				{/each}
			</div>
		</div>
	{:else}
		<div class="mt-10 flex flex-col items-center justify-center gap-10">
			<div class="flex flex-col items-center justify-center gap-2">
				<h1 class="text-2xl font-bold">Memento Mori</h1>
				<p class="text-center italic">
					"Let us prepare our minds as if we’d come to the very end of life. Let us postpone
					nothing."
				</p>
				<p class="self-end">-Seneca</p>
			</div>
			<Birth data={data?.form} />
		</div>
	{/if}
{/key}
