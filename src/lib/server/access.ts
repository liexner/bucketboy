import { env } from '$env/dynamic/private';
import { error } from '@sveltejs/kit';

export function canAccessBucket(bucket: string, roles: string[] | undefined) {
	const allowed = getAllowedBuckets(roles);
	if (allowed && !allowed.has(bucket)) error(403, 'Access denied');
}

export function getAllowedBuckets(roles: string[] | undefined) {
	const isAdmin = roles?.includes('admin');
	if (isAdmin || !env.USER_BUCKETS) return null;
	return new Set(env.USER_BUCKETS.split(',').map((b) => b.trim()));
}
