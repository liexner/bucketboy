<script lang="ts">
	import "./layout.css"
	import favicon from "$lib/assets/favicon.svg"
	import { signOut } from "@auth/sveltekit/client"
	import { page } from "$app/stores"

	let { children } = $props()
	const session = $derived($page.data.session)
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

{#if session?.user}
	<header class="flex items-center justify-between border-b px-6 py-3 text-sm">
		<a href="/" class="font-semibold">Bucketboy</a>
		<div class="flex items-center gap-4 text-gray-500">
			<span>{session.user.email ?? session.user.name}</span>
			<button onclick={() => signOut({ callbackUrl: "/logout" })} class="hover:text-black">
				Sign out
			</button>
		</div>
	</header>
{/if}

{@render children()}
