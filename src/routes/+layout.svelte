<!-- src/routes/+layout.svelte -->
<script lang="ts">
	import '../app.pcss';
	import Header from '@/components/Header.svelte';
	import { ModeWatcher } from 'mode-watcher';

	import { invalidate } from '$app/navigation';
	import { onMount } from 'svelte';
	import { redirect } from '@sveltejs/kit';

	export let data;

	let { supabase, session } = data;
	$: ({ supabase, session } = data);

	onMount(() => {
		const { data } = supabase.auth.onAuthStateChange((event, _session) => {
			if (_session?.expires_at !== session?.expires_at) {
				invalidate('supabase:auth');
			}
		});

		return () => data.subscription.unsubscribe();
	});
</script>

<svelte:head>
	<title>User Management</title>
</svelte:head>

<div class="">
	<ModeWatcher />
	<Header />
	<slot />
</div>
