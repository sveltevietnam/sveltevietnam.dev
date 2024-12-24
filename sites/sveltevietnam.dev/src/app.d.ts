declare global {
	declare module '*&imagetools' {
		const src: string;
		export default src;
	}

	namespace App {
		interface PageData {
			/**
			 * per-page page metadata setup
			 * {@see $routes/+layout.svelte} for defaults
			 */
			meta?: {
				title?: string;
				description?: string;
				keywords?: string[];
				canonical?: string;
				structured?: string; // Structured Data LD+JSON
				og?: {
					title?: string;
					site_name?: string;
					description?: string;
					type?: 'website' | 'article' | 'profile';
					image?: string;
					imageAlt?: string;
					url?: string;
				};
				twitter?: {
					title?: string;
					description?: string;
					card?: string;
					image?: string;
					imageAlt?: string;
					site?: string;
					creator?: string;
				};
			};
		}

		// interface PageState {}
		interface Platform {
			env?: Record<string, never>;
			context: import('@cloudflare/workers-types').ExecutionContext;
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
