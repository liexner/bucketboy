import { ListObjectsV2Command } from "@aws-sdk/client-s3"
import { s3 } from "$lib/server/s3"
import { canAccessBucket } from "$lib/server/access"
import type { PageServerLoad } from "./$types"

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
		folders: (result.CommonPrefixes ?? []).map((p) => p.Prefix!),
		files: (result.Contents ?? []).filter((c) => c.Key !== prefix),
	}
}
