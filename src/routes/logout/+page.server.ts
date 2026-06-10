import { redirect } from "@sveltejs/kit"
import { env } from "$env/dynamic/private"
import type { PageServerLoad } from "./$types"

export const load: PageServerLoad = async (event) => {
	const url = new URL(`${env.OIDC_ISSUER}/protocol/openid-connect/logout`)
	url.searchParams.set("client_id", env.OIDC_CLIENT_ID)
	url.searchParams.set("post_logout_redirect_uri", event.url.origin)
	redirect(303, url.toString())
}
