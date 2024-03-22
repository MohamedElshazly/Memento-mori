<script lang="ts" context="module">
	import { z } from 'zod';

	export const formSchema = z.object({
		dob: z.string().refine((v) => v, { message: 'A date of birth is required.' })
	});

	export type FormSchema = typeof formSchema;
</script>

<script lang="ts">
	import { browser } from '$app/environment';
	import { page } from '$app/stores';
	import CalendarIcon from 'lucide-svelte/icons/calendar';
	import {
		type DateValue,
		DateFormatter,
		getLocalTimeZone,
		parseDate,
		CalendarDate,
		today
	} from '@internationalized/date';
	import { cn } from '$lib/utils.js';
	import { Button, buttonVariants } from '$lib/components/ui/button/index.js';
	import { Calendar } from '$lib/components/ui/calendar/index.js';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import * as Form from '$lib/components/ui/form/index.js';
	import type { SuperValidated, Infer } from 'sveltekit-superforms';
	import SuperDebug, { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { toast } from 'svelte-sonner';
	import { onMount } from 'svelte';
	import { Progress } from './ui/progress';
	export let data: SuperValidated<Infer<FormSchema>>;

	let progressValue = 5;
	onMount(() => {
		const timer = setTimeout(() => (progressValue = 33), 2000);
		return () => clearTimeout(timer);
	});
	const form = superForm(data, {
		validators: zodClient(formSchema),
		taintedMessage: null,
		delayMs: 3000,
		timeoutMs: 8000,
		onUpdated: ({ form: f }) => {
			if (f.valid) {
				toast.success('You submitted' + JSON.stringify(f.data, null, 2));
			} else {
				toast.error('Please fix the errors in the form.');
			}
		}
	});

	const { form: formData, enhance, submitting, delayed } = form;

	const df = new DateFormatter('en-US', {
		dateStyle: 'long'
	});

	let value: DateValue | undefined;

	$: value = $formData.dob ? parseDate($formData.dob) : undefined;

	let placeholder: DateValue = today(getLocalTimeZone());
</script>

<form method="POST" class="flex flex-col items-center space-y-8" use:enhance>
	<Form.Field {form} name="dob" class="flex flex-col items-center justify-center">
		<Form.Control let:attrs>
			<Form.Label>Date of birth</Form.Label>
			<Popover.Root>
				<Popover.Trigger
					{...attrs}
					class={cn(
						buttonVariants({ variant: 'outline' }),
						'w-[280px] justify-start pl-4 text-left font-normal',
						!value && 'text-muted-foreground'
					)}
				>
					{value ? df.format(value.toDate(getLocalTimeZone())) : 'Pick a date'}
					<CalendarIcon class="ml-auto h-4 w-4 opacity-50" />
				</Popover.Trigger>
				<Popover.Content class="w-auto p-0" side="top">
					<Calendar
						{value}
						bind:placeholder
						minValue={new CalendarDate(1900, 1, 1)}
						maxValue={today(getLocalTimeZone())}
						calendarLabel="Date of birth"
						initialFocus
						onValueChange={(v) => {
							if (v) {
								$formData.dob = v.toString();
							} else {
								$formData.dob = '';
							}
						}}
					/>
				</Popover.Content>
			</Popover.Root>
			<Form.Description
				>Your date of birth is used to calculator your age, and generate the calendar</Form.Description
			>
			<Form.FieldErrors />
			<input hidden value={$formData.dob} name={attrs.name} />
		</Form.Control>
	</Form.Field>
	<Button type="submit">Generate calendar</Button>
	{#if $delayed || $submitting}
		<Progress value={progressValue} max={100} class="w-[60%]" />
	{/if}
	<div class="w-full">
		<!-- {#if browser}
			<SuperDebug data={$formData} />
		{/if} -->
	</div>
</form>
