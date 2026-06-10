import { S3Client } from "@aws-sdk/client-s3"
import { env } from "$env/dynamic/private"

export const s3 = new S3Client({
	region: env.S3_REGION ?? "us-east-1",
	endpoint: env.S3_ENDPOINT,
	forcePathStyle: true,
	credentials: {
		accessKeyId: env.S3_ACCESS_KEY!,
		secretAccessKey: env.S3_SECRET_KEY!,
	},
})
