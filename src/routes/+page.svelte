<script lang="ts">
	import { signOut } from "@auth/sveltekit/client"
	import { page } from "$app/stores"

	const session = $derived($page.data.session)
</script>

<main class="flex min-h-screen flex-col items-center justify-center gap-4">
	<p>Signed in as <strong>{session?.user?.email ?? session?.user?.name}</strong></p>
	<button onclick={() => signOut({ callbackUrl: "/logout" })}>Sign out</button>
</main>
