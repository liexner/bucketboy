<script lang="ts">
	import { signIn } from "@auth/sveltekit/client"
	import { page } from "$app/stores"
	import { onMount } from "svelte"

	onMount(() => {
		signIn("oidc", { callbackUrl: $page.url.searchParams.get("callbackUrl") ?? "/" })
	})
</script>
