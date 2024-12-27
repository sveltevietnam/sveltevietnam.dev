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
			language: Language;
		};

		interface Locals {
			userId: string;
			internalReferer?: URL;
			sharedSettings: SharedSettings;
		}

		interface PageData {
			routing: {
				map: Record<App.RouteKey, App.Route>;
				key: App.RouteKey;
				breadcrumbs: App.Route[];
				paths: Record<App.Language, App.Route>;
			};
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
