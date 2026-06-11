<script lang="ts">
	import type { PageData } from "./$types"

	let { data }: { data: PageData } = $props()
</script>

<main class="mx-auto max-w-4xl px-6 py-8">
	<h1 class="mb-6 text-lg font-semibold">Buckets</h1>
	{#if data.buckets.length === 0}
		<p class="text-white/50">No buckets found.</p>
	{:else}
		<ul class="divide-y divide-white/20 rounded-md border border-white/20">
			{#each data.buckets as bucket (bucket.Name)}
				<li>
					<a
						href="/{bucket.Name}"
						class="flex items-center gap-3 px-4 py-3 hover:bg-white/5"
					>
						<span>🪣</span>
						<span>{bucket.Name}</span>
					</a>
				</li>
			{/each}
		</ul>
	{/if}
</main>
