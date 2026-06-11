import { ListBucketsCommand } from "@aws-sdk/client-s3"
import { s3 } from "$lib/server/s3"
import { env } from "$env/dynamic/private"
import type { PageServerLoad } from "./$types"

export const load: PageServerLoad = async (event) => {
	const session = await event.locals.auth()
	const isAdmin = session?.user.roles?.includes("admin")

	const { Buckets } = await s3.send(new ListBucketsCommand({}))
	const allBuckets = Buckets ?? []

	if (isAdmin || !env.USER_BUCKETS) return { buckets: allBuckets }

	const allowed = new Set(env.USER_BUCKETS.split(",").map((b) => b.trim()))
	return { buckets: allBuckets.filter((b) => allowed.has(b.Name ?? "")) }
}

