<script lang="ts">
	import { enhance } from "$app/forms"
	import { invalidateAll } from "$app/navigation"

	let { bucket, prefix, canWrite }: { bucket: string; prefix: string; canWrite: boolean } = $props()

	let showFolderForm = $state(false)
	let folderInput = $state("")
	let creatingFolder = $state(false)

	let fileInput: HTMLInputElement
	let uploads = $state<{ name: string; progress: number; error?: string }[]>([])

	async function handleFiles(files: FileList) {
		for (const file of Array.from(files)) {
			const key = `${prefix}${file.name}`
			uploads.push({ name: file.name, progress: 0 })
			const idx = uploads.length - 1

			try {
				const res = await fetch(
					`/upload?bucket=${encodeURIComponent(bucket)}&key=${encodeURIComponent(key)}`,
				)
				if (!res.ok) throw new Error(await res.text())
				const { url } = await res.json()

				await new Promise<void>((resolve, reject) => {
					const xhr = new XMLHttpRequest()
					xhr.upload.onprogress = (e) => {
						if (e.lengthComputable) uploads[idx].progress = Math.round((e.loaded / e.total) * 100)
					}
					xhr.onload = () => (xhr.status < 300 ? resolve() : reject(new Error(`${xhr.status}`)))
					xhr.onerror = () => reject(new Error("Network error"))
					xhr.open("PUT", url)
					xhr.send(file)
				})

				uploads[idx].progress = 100
			} catch (e) {
				uploads[idx].error = e instanceof Error ? e.message : "Upload failed"
			}
		}

		await invalidateAll()
		setTimeout(() => (uploads = []), 2000)
	}
</script>

{#if canWrite}
<div class="mb-4 flex items-center gap-2">
	<button
		onclick={() => { showFolderForm = !showFolderForm; folderInput = "" }}
		class="rounded px-3 py-1.5 text-sm border border-white/20 hover:bg-white/10"
	>
		New folder
	</button>
	<button
		onclick={() => fileInput.click()}
		class="rounded px-3 py-1.5 text-sm border border-white/20 hover:bg-white/10"
	>
		Upload
	</button>
	<input
		bind:this={fileInput}
		type="file"
		multiple
		class="hidden"
		onchange={(e) => {
			if (e.currentTarget.files?.length) handleFiles(e.currentTarget.files)
			e.currentTarget.value = ""
		}}
	/>
</div>

{#if showFolderForm}
	<form
		method="POST"
		action="?/createFolder"
		class="mb-4 flex items-center gap-2"
		use:enhance={() => {
			creatingFolder = true
			return async ({ update }) => {
				await update()
				creatingFolder = false
				showFolderForm = false
				folderInput = ""
			}
		}}
	>
		<input
			name="name"
			bind:value={folderInput}
			placeholder="Folder name"
			autofocus
			class="rounded border border-white/20 bg-white/5 px-3 py-1.5 text-sm outline-none focus:border-white/50"
		/>
		<button
			type="submit"
			disabled={!folderInput.trim() || creatingFolder}
			class="rounded px-3 py-1.5 text-sm border border-white/20 hover:bg-white/10 disabled:opacity-40"
		>
			Create
		</button>
		<button
			type="button"
			onclick={() => { showFolderForm = false; folderInput = "" }}
			class="text-sm text-white/50 hover:text-white"
		>
			Cancel
		</button>
	</form>
{/if}

{/if}

{#if uploads.length > 0}
	<ul class="mb-4 divide-y divide-white/10 rounded border border-white/20">
		{#each uploads as u (u.name)}
			<li class="flex items-center gap-3 px-4 py-2 text-sm">
				<span class="flex-1 truncate">{u.name}</span>
				{#if u.error}
					<span class="text-red-400">{u.error}</span>
				{:else if u.progress < 100}
					<span class="text-white/50">{u.progress}%</span>
					<div class="h-1 w-24 overflow-hidden rounded bg-white/20">
						<div class="h-full bg-white/70 transition-all" style="width:{u.progress}%"></div>
					</div>
				{:else}
					<span class="text-white/50">Done</span>
				{/if}
			</li>
		{/each}
	</ul>
{/if}
