import { redirect, type Handle } from "@sveltejs/kit"
import { handle as authHandle } from "./auth"
import { sequence } from "@sveltejs/kit/hooks"
import { env } from "$env/dynamic/private"

const publicPaths = ["/auth", "/login", "/logout"]

const authorizationHandle: Handle = async ({ event, resolve }) => {
	if (env.OIDC_ENABLE !== "true") return resolve(event)
	const isPublic = publicPaths.some((p) => event.url.pathname.startsWith(p))
	if (!isPublic) {
		const session = await event.locals.auth()
		if (!session) redirect(303, `/login?callbackUrl=${event.url.pathname}`)
	}
	return resolve(event)
}

export const handle: Handle = sequence(authHandle, authorizationHandle)
