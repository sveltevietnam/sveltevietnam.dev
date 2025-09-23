/// <reference types="umami-browser" />
import type { Language } from '@sveltevietnam/i18n';
import type { AppLocals, AppPlatform, PageMetadata } from '@sveltevietnam/kit';

declare global {
	declare type MaybePromise<T> = T | Promise<T> | PromiseLike<T>;
	declare const __BUILD_TIMESTAMP__: string;

	declare module '*&imagetools' {
		export default import('vite-imagetools').Picture;
	}

	interface Window {
		umami?: umami.umami;
	}

	namespace App {
		interface Locals extends AppLocals {
			auth: import('$lib/auth').Auth;
			session: import('$lib/auth').Session | null;
			user: import('$lib/auth').User | null;
		}

		interface PageData {
			routing?: {
				paths: Record<Language, string>;
			};
			meta?: PageMetadata;
		}

		// interface PageState {}

		interface Platform extends AppPlatform {
			env?: {
				AUTHENTICATE_RESENT_WAITING_MS: number;
				AUTHENTICATE_EMAIL_EXPIRATION_SECONDS: number;
				d1: import('@cloudflare/workers-types').D1Database;
				r2: import('@cloudflare/workers-types').R2Bucket;
				backend: import('@sveltevietnam/backend').default;
			};
		}

		interface Error {
			code: string;
		}
	}
}

export {};
