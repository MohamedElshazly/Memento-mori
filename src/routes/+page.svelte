<script lang="ts">
	import { differenceInWeeks } from 'date-fns';
	import Cell from '@/components/Cell.svelte';
	import { onMount } from 'svelte';
	import Button from '@/components/ui/button/button.svelte';
	import Birth from '@/components/Birth.svelte';
	export let data;
	let { supabase, calendarStatus, weeks } = data;
	$: ({ supabase, calendarStatus } = data);
	const noOfWeeks = 3840;

	const noWeeksSinceDOB = weeks.length;
	console.log('weeks :>> ', weeks);
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
					<Cell week={i + 1} canCheck={weeks[i].can_check} />
				{:else}
					<Cell week={i + 1} canCheck={true} />
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
