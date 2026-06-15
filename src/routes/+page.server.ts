import { ListBucketsCommand } from '@aws-sdk/client-s3';
import { s3 } from '$lib/server/s3';
import type { PageServerLoad } from './$types';
import { getAllowedBuckets } from '$lib/server/access';

export const load: PageServerLoad = async (event) => {
	const session = await event.locals.auth();

	const { Buckets } = await s3.send(new ListBucketsCommand({}));
	const allBuckets = Buckets ?? [];

	const allowed = getAllowedBuckets(session?.user?.roles);
	if (!allowed) return { buckets: allBuckets };
	return { buckets: allBuckets.filter((b) => allowed?.has(b.Name ?? '')) };
};
