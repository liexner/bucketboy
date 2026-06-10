import { ListBucketsCommand } from "@aws-sdk/client-s3"
import { s3 } from "$lib/server/s3"
import type { PageServerLoad } from "./$types"

export const load: PageServerLoad = async () => {
	const { Buckets } = await s3.send(new ListBucketsCommand({}))
	return { buckets: Buckets ?? [] }
}
