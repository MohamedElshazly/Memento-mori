import { formSchema } from '@/components/Birth.svelte';
import { fail, type Actions } from '@sveltejs/kit';
import { differenceInWeeks } from 'date-fns';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

import type { PageServerLoad } from './$types.js';

export const load: PageServerLoad = async () => {
	return {
		form: await superValidate(zod(formSchema))
	};
};

export const actions: Actions = {
	default: async (event) => {
		const session = await event?.locals?.getSession();
		const { supabase } = event?.locals || {};
		const form = await superValidate(event, zod(formSchema));
		if (!form.valid) {
			return fail(400, {
				form
			});
		}

		//get calendar status
		const { data, error } = await supabase.from('profiles').select('calendar_initialized');

		if (error) {
			console.error('error', error);
		}
		//check if calendar is not initialized, initialize it
		if (!data?.[0].calendar_initialized) {
			const DOB = new Date(form.data.dob);
			const noWeeksSinceDOB = differenceInWeeks(new Date(), DOB);
			const weeksRows = Array.from({ length: noWeeksSinceDOB }, (_, i) => ({
				week_id: i + 1,
				user_id: session?.user?.id,
				checked: true
			}));

			await supabase
				.from('weeks')
				.insert([...weeksRows])
				.eq('id', session?.user?.id);
		}

		await supabase
			.from('profiles')
			.update({ calendar_initialized: true, dob: form.data.dob })
			.eq('id', session?.user?.id);

		return {
			form
		};
	}
};
