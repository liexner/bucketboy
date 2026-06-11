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
	callbacks: {
		jwt({ token, profile }) {
			if (profile?.roles) token.roles = profile.roles as string[]
			return token
		},
		session({ session, token }) {
			session.user.roles = (token.roles as string[]) ?? []
			return session
		},
	},
	trustHost: true,
})
