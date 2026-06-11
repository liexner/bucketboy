<script lang="ts">
	import "./layout.css"
	import { signOut } from "@auth/sveltekit/client"
	import { page } from "$app/stores"

	let { children } = $props()
	const session = $derived($page.data.session)
</script>

<svelte:head>
	<title>Bucketboy</title>
	<link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🪣</text></svg>" />
</svelte:head>

{#if session?.user}
	<header class="flex items-center justify-between border-b border-white/20 px-6 py-3 text-sm">
		<a href="/" class="font-semibold">Bucketboy</a>
		<div class="flex items-center gap-4 text-white/50">
			{#if session.user.roles?.includes("admin")}
				<span class="rounded bg-white/10 px-2 py-0.5 text-xs text-white">admin</span>
			{/if}
			<span>{session.user.email ?? session.user.name}</span>
			<button onclick={() => signOut({ callbackUrl: "/logout" })} class="hover:text-white">
				Sign out
			</button>
		</div>
	</header>
{/if}

{@render children()}
