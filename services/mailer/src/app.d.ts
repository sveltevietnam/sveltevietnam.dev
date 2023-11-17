/// <reference types="@sveltejs/kit" />
/// <reference types="svelte" />
/// <reference types="vite/client" />
/// <reference types="@sveltejs/adapter-cloudflare" />

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
// and what to do when importing types
declare global {
	declare const __BUILD_TIMESTAMP__: string;
	namespace App {
		interface Locals {
			d1: import('@cloudflare/workers-types').D1Database;
		}
		// interface PageData {}

		interface Platform {
			env?: {
				D1: import('@cloudflare/workers-types').D1Database;
			};
			context: {
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				waitUntil(promise: Promise<any>): void;
			};
			caches: import('@cloudflare/workers-types').CacheStorage & {
				default: import('@cloudflare/workers-types').Cache;
			};
		}
		interface Error {
			code: string;
		}
	}
}

export {};
