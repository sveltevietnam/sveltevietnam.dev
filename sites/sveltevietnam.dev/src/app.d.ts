declare global {
	declare module '*&imagetools' {
		const src: string;
		export default src;
	}

	namespace App {
		declare type ColorScheme = import('$lib/constants').ColorScheme;
		declare type Screen = import('$lib/constants').Screen;
		declare type Status = import('$lib/constants').Status;
		declare type Language = import('@internals/utils/language').Language;
		declare type SharedSettings = {
			colorScheme: ColorScheme;
		};
		declare type Route = {
			path: string;
			label: string;
		};

		interface Locals {
			language: Language;
			userId: string;
			internalReferer?: URL;
			sharedSettings: SharedSettings;
		}

		interface PageData {
			language: Language;
			sharedSettings: SharedSettings;
			/**
			 * per-page page metadata setup
			 * {@see $routes/(site)/+layout.svelte} for defaults
			 */
			meta?: import('$lib/meta').PageMetadata;
		}

		// interface PageState {}
		interface Platform {
			env?: Record<string, never>;
			cf?: import('@cloudflare/workers-types').IncomingRequestCfProperties;
			context?: import('@cloudflare/workers-types').ExecutionContext;
			caches?: import('@cloudflare/workers-types').CacheStorage & {
				default: import('@cloudflare/workers-types').Cache;
			};
		}

		interface Error {
			code: string;
		}
	}
}

export {};

