import { SvelteKitAuth } from "@auth/sveltekit"
import { env } from "$env/dynamic/private"

export const { handle } = SvelteKitAuth({
	providers: [
		{
			id: "oidc",
			name: "SSO",
			type: "oidc",
			issuer: env.OIDC_ISSUER,
			clientId: env.OIDC_CLIENT_ID,
			clientSecret: env.OIDC_CLIENT_SECRET,
		},
	],
	trustHost: true,
})
