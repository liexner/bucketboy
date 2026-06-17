<script lang="ts">
	import { enhance } from "$app/forms"

	let { action, field, value }: { action: string; field: string; value: string } = $props()

	let pending = $state(false)
</script>

{#if pending}
	<form
		method="POST"
		{action}
		use:enhance={() => {
			pending = false
			return async ({ update }) => update()
		}}
	>
		<input type="hidden" name={field} {value} />
		<button type="submit" class="text-base leading-none" title="Confirm delete">✅</button>
	</form>
{:else}
	<button
		onclick={() => (pending = true)}
		class="text-base leading-none opacity-30 hover:opacity-100"
		title="Delete"
	>🗑️</button>
{/if}
