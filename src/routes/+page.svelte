<script lang="ts">
	import { differenceInWeeks } from 'date-fns';
	import Cell from '@/components/Cell.svelte';
	import { onMount } from 'svelte';
	import Button from '@/components/ui/button/button.svelte';
	import Birth from '@/components/Birth.svelte';
	const noOfWeeks = 3840;
	const DOB = new Date(1999, 4, 1);
	const noWeeksSinceDOB = differenceInWeeks(new Date(), DOB);
	const currentWeek = Array(noOfWeeks).fill(0)[noWeeksSinceDOB - 1];
	const canCheck = (week: number) => week >= currentWeek;
	export let data;

	let { supabase, calendarStatus } = data;
	$: ({ supabase, calendarStatus } = data);
</script>

{#if calendarStatus}
	<div class="mt-10 flex flex-col items-center justify-center gap-10">
		<div class="flex flex-col items-center justify-center gap-2">
			<h1 class="text-2xl font-bold">Memento Mori</h1>
			<p class="text-center italic">
				"Let us prepare our minds as if we’d come to the very end of life. Let us postpone nothing."
			</p>
			<p class="self-end">-Seneca</p>
		</div>
		<div class="grid gap-2" style="grid-template-columns: repeat(24, minmax(0, 1fr));">
			{#each Array(noOfWeeks) as _, i}
				{#if i < noWeeksSinceDOB}
					<Cell week={i + 1} canCheck={false} />
				{:else}
					<Cell week={i + 1} canCheck={canCheck(i + 1)} />
				{/if}
			{/each}
		</div>
	</div>
{:else}
	<div class="mt-10 flex flex-col items-center justify-center gap-10">
		<div class="flex flex-col items-center justify-center gap-2">
			<h1 class="text-2xl font-bold">Memento Mori</h1>
			<p class="text-center italic">
				"Let us prepare our minds as if we’d come to the very end of life. Let us postpone nothing."
			</p>
			<p class="self-end">-Seneca</p>
		</div>
		<Birth data={data?.form} />
		<!-- <Button variant="default" on:click={() => {}}>Generate Calendar</Button> -->
	</div>
{/if}
