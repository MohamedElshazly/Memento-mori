<script lang="ts">
	export let data;

	let { supabase } = data;
	$: ({ supabase } = data);

	const handleSignIn = () => {
		supabase.auth.signInWithOAuth({
			provider: 'google',
			options: {
				redirectTo: 'http://localhost:5173/auth/callback'
			}
		});
	};
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="box-border flex h-full min-h-screen items-center justify-center overflow-y-hidden">
	<div
		class="flex items-center hover:cursor-pointer"
		on:click={handleSignIn}
		on:keydown={handleSignIn}
	>
		Sign in with Google
	</div>
</div>
