import { env } from "$env/dynamic/private"
import { error } from "@sveltejs/kit"

export function canAccessBucket(bucket: string, roles: string[] | undefined) {
	const isAdmin = roles?.includes("admin")
	if (isAdmin || !env.USER_BUCKETS) return

	const allowed = new Set(env.USER_BUCKETS.split(",").map((b) => b.trim()))
	if (!allowed.has(bucket)) error(403, "Access denied")
}
