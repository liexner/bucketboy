<script lang="ts">
	import type { PageData } from "./$types"

	let { data }: { data: PageData } = $props()

	const segments = $derived(data.prefix ? data.prefix.slice(0, -1).split("/") : [])

	function folderName(prefix: string) {
		const parts = prefix.slice(0, -1).split("/")
		return parts[parts.length - 1]
	}

	function folderHref(prefix: string) {
		return `/${data.bucket}/${prefix.slice(0, -1)}`
	}

	function formatSize(bytes: number | undefined) {
		if (!bytes) return "—"
		if (bytes < 1024) return `${bytes} B`
		if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
		if (bytes < 1024 * 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(1)} MB`
		return `${(bytes / 1024 / 1024 / 1024).toFixed(1)} GB`
	}

	function fileName(key: string) {
		return key.split("/").pop() ?? key
	}

	function segmentHref(i: number) {
		return `/${data.bucket}/${segments.slice(0, i + 1).join("/")}`
	}
</script>

<main class="mx-auto max-w-4xl px-6 py-8">
	<nav class="mb-6 flex items-center gap-1 text-sm">
		<a href="/" class="text-white/60 hover:text-white">Buckets</a>
		<span class="text-white/30">/</span>
		{#if segments.length === 0}
			<span class="font-medium">{data.bucket}</span>
		{:else}
			<a href="/{data.bucket}" class="text-white/60 hover:text-white">{data.bucket}</a>
			{#each segments as segment, i (segment)}
				<span class="text-white/30">/</span>
				{#if i === segments.length - 1}
					<span class="font-medium">{segment}</span>
				{:else}
					<a href={segmentHref(i)} class="text-white/60 hover:text-white">{segment}</a>
				{/if}
			{/each}
		{/if}
	</nav>

	{#if data.folders.length === 0 && data.files.length === 0}
		<p class="text-white/50">Empty.</p>
	{:else}
		<ul class="divide-y divide-white/20 rounded-md border border-white/20">
			{#each data.folders as folder (folder)}
				<li>
					<a
						href={folderHref(folder)}
						class="flex items-center gap-3 px-4 py-3 hover:bg-white/5"
					>
						<span>📁</span>
						<span>{folderName(folder)}</span>
					</a>
				</li>
			{/each}
			{#each data.files as file (file.Key)}
				<li class="flex items-center gap-3 px-4 py-3">
					<span>📄</span>
					<span class="flex-1 truncate">{fileName(file.Key!)}</span>
					<span class="text-sm text-white/40">{formatSize(file.Size)}</span>
					<a
						href="/download?bucket={data.bucket}&key={encodeURIComponent(file.Key!)}"
						class="ml-4 text-sm text-white/60 hover:text-white"
						data-sveltekit-preload-data="off"
					>
						Download
					</a>
				</li>
			{/each}
		</ul>
	{/if}
</main>
