import { PutObjectCommand } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import { s3 } from "$lib/server/s3"
import { canAccessBucket, canWrite } from "$lib/server/access"
import { error, json } from "@sveltejs/kit"
import type { RequestHandler } from "./$types"

export const GET: RequestHandler = async ({ url, locals }) => {
	const bucket = url.searchParams.get("bucket")
	const key = url.searchParams.get("key")

	if (!bucket || !key) error(400, "Missing bucket or key")

	const session = await locals.auth()
	canAccessBucket(bucket, session?.user.roles)
	if (!canWrite(session?.user.roles)) error(403, "Access denied")

	const signed = await getSignedUrl(
		s3,
		new PutObjectCommand({ Bucket: bucket, Key: key }),
		{ expiresIn: 3600 },
	)

	return json({ url: signed })
}
