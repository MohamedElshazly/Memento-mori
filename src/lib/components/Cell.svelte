<script lang="ts">
	import * as Sheet from '$lib/components/ui/sheet';
	import { Checkbox } from '$lib/components/ui/checkbox';
	import * as HoverCard from '$lib/components/ui/hover-card';
	import Notes from './Notes.svelte';
	import { formatRFC7231, add } from 'date-fns';

	export let canCheck = true;
	export let isChecked = canCheck ? false : true;
	export let week: number;
	const currentDate = formatRFC7231(add(new Date(1999, 4, 1), { weeks: week }));
	{
		//refactor this to get its state from BE
	}
</script>

<Sheet.Root>
	<Sheet.Trigger>
		<HoverCard.Root>
			<HoverCard.Trigger
				><Checkbox
					id={`${week}`}
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
			<Sheet.Title>Week {week}</Sheet.Title>
			<Sheet.Description>
				You can check this week here, and add notable events, or any notes you want to remember.
			</Sheet.Description>
		</Sheet.Header>
		{#if canCheck}
			<Checkbox bind:checked={isChecked} />
		{/if}
		<Notes />
	</Sheet.Content>
</Sheet.Root>
