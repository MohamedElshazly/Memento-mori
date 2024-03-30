<script lang="ts">
	import * as Sheet from '$lib/components/ui/sheet';
	import { Checkbox } from '$lib/components/ui/checkbox';
	import * as HoverCard from '$lib/components/ui/hover-card';
	import Notes from './Notes.svelte';
	import { formatRFC7231, add } from 'date-fns';
	import type { Weeks } from '../../global.types';
	import { toNumber } from 'lodash-es';
	import { CellOperations } from '@/services/cellOps';

	export let week: Weeks | undefined = undefined;
	export let idx: number | undefined = undefined;
	export let currentWeek: number;

	const { onCellCheck } = CellOperations();
	let isChecked = week?.checked ? true : false;
	const canCheck = week ? week.week_id === currentWeek : idx === currentWeek;
	const currentDate = formatRFC7231(add(new Date(1999, 4, 1), { weeks: idx }));
</script>

<Sheet.Root>
	<Sheet.Trigger>
		<HoverCard.Root>
			<HoverCard.Trigger
				><Checkbox
					id={`${idx}`}
					checked={isChecked}
					on:click={(e) => {
						e.preventDefault();
						return false;
					}}
				/></HoverCard.Trigger
			>
			<HoverCard.Content>{currentDate}</HoverCard.Content>
		</HoverCard.Root>
	</Sheet.Trigger>
	<Sheet.Content>
		<Sheet.Header>
			<Sheet.Title>Week {week?.week_id || idx}</Sheet.Title>
			<Sheet.Description>
				You can check this week here, and add notable events, or any notes you want to remember.
			</Sheet.Description>
		</Sheet.Header>
		{#if canCheck}
			<Checkbox
				bind:checked={isChecked}
				on:click={() => {
					onCellCheck(toNumber(idx || week?.week_id), week);
				}}
			/>
		{/if}
		<Notes />
	</Sheet.Content>
</Sheet.Root>
