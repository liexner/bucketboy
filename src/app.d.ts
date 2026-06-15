import type { DefaultSession } from '@auth/sveltekit';

declare module '@auth/core/types' {
	interface User {
		roles?: string[];
	}
	interface Session {
		user: DefaultSession['user'] & {
			roles: string[];
		};
	}
}

declare global {
	namespace App {
		interface Locals {
			auth(): Promise<DefaultSession | null>;
		}
		interface PageData {
			session: DefaultSession | null;
		}
	}
}

export {};
