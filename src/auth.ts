import { SvelteKitAuth } from '@auth/sveltekit';
import { env } from '$env/dynamic/private';

export const { handle } = SvelteKitAuth({
	providers: [
		{
			id: 'oidc',
			name: 'SSO',
			type: 'oidc',
			issuer: env.OIDC_ISSUER,
			clientId: env.OIDC_CLIENT_ID,
			clientSecret: env.OIDC_CLIENT_SECRET
		}
	],
	callbacks: {
		jwt({ token, profile }) {
			const rolesClaim = env.OIDC_ROLES_CLAIM ?? 'roles';

			const roles = getNestedClaim(profile, rolesClaim);
			if (roles) token.roles = roles as string[];

			return token;
		},
		session({ session, token }) {
			session.user.roles = (token.roles as string[]) ?? [];
			return session;
		}
	},
	trustHost: true
});

function getNestedClaim(profile: Record<string, unknown>, path: string) {
	return path
		.split('.')
		.reduce<unknown>(
			(obj, key) =>
				obj && typeof obj === 'object' ? (obj as Record<string, unknown>)[key] : undefined,
			profile
		);
};
