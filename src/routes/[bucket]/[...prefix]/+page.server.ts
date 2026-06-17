import { ListObjectsV2Command, PutObjectCommand } from "@aws-sdk/client-s3"
import { s3 } from "$lib/server/s3"
import { canAccessBucket, canWrite } from "$lib/server/access"
import { error } from "@sveltejs/kit"
import type { PageServerLoad, Actions } from "./$types"

export const load: PageServerLoad = async ({ params, locals }) => {
	const session = await locals.auth()
	canAccessBucket(params.bucket, session?.user.roles)
	const prefix = params.prefix ? `${params.prefix}/` : ""

	const result = await s3.send(
		new ListObjectsV2Command({
			Bucket: params.bucket,
			Prefix: prefix,
			Delimiter: "/",
		}),
	)

	return {
		bucket: params.bucket,
		prefix,
		canWrite: canWrite(session?.user.roles),
		folders: (result.CommonPrefixes ?? []).map((p) => p.Prefix!),
		files: (result.Contents ?? []).filter((c) => c.Key !== prefix),
	}
}

export const actions: Actions = {
	createFolder: async ({ params, request, locals }) => {
		const session = await locals.auth()
		canAccessBucket(params.bucket, session?.user.roles)
		if (!canWrite(session?.user.roles)) error(403, "Access denied")

		const data = await request.formData()
		const name = (data.get("name") as string)?.trim()
		if (!name || name.includes("/")) error(400, "Invalid folder name")

		const prefix = params.prefix ? `${params.prefix}/` : ""
		const key = `${prefix}${name}/`

		await s3.send(new PutObjectCommand({ Bucket: params.bucket, Key: key, Body: "" }))

		return { key }
	},
}
