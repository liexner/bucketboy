import { redirect } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import type { PageServerLoad } from './$types';
import { error } from 'console';

export const load: PageServerLoad = async (event) => {
	const response = await fetch(`${env.OIDC_ISSUER}/.well-known/openid-configuration`);
	if (!response.ok) error(502, 'Failed to fetch OIDC discovery document');

	const { end_session_endpoint } = await response.json();
	if (!end_session_endpoint) redirect(303, '/');

	const url = new URL(end_session_endpoint);
	url.searchParams.set('client_id', env.OIDC_CLIENT_ID);
	url.searchParams.set('post_logout_redirect_uri', event.url.origin);
	redirect(303, url.toString());
};
