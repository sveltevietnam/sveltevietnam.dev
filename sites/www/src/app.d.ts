/// <reference types="@sveltejs/kit" />
/// <reference types="svelte" />
/// <reference types="vite/client" />
/// <reference types="@sveltejs/adapter-cloudflare" />

import type { LocalizedRouteMap } from '$client/contexts/navigation';
import type { COLOR_SCHEMES, STATUSES } from '$shared/constants';
import type { preparePageData } from '$shared/data/blog';
import type { Language } from '$shared/services/i18n';

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
// and what to do when importing types
declare global {
	declare const __BUILD_TIMESTAMP__: string;

	declare module '*&imagetools' {
		const src: string;
		export default src;
	}

	/**
	 * Svelte fails to automatically type imported mdsvex-svelte hybrid files
	 * that have code blocks in it. This module is a workaround for that
	 */
	declare module '*.svelte?mdsvex' {
		const component: import('svelte').ComponentType<import('svelte').SvelteComponent>;

		export default component;
	}

	namespace App {
		declare type Status = (typeof STATUSES)[number];
		declare type ColorScheme = (typeof COLOR_SCHEMES)[number];
		declare type Route = {
			key: string;
			path: string;
			label: string;
		};

		interface Locals {
			userId: string;
			colorScheme: ColorScheme;
			language: Language;
			version: string;
			internalReferer?: URL;
			routes: LocalizedRouteMap;
		}
		interface PageData {
			colorScheme: ColorScheme;
			language: Language;
			route: {
				current: Route;
				alternate: Record<Language, Omit<Route, 'key'>>;
			};
			meta?: {
				title?: string;
				description?: string;
				keywords?: string[];
				canonical?: string;
				structured?: string; // Structured Data LD+JSON
				og?: {
					title?: string;
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
			// for [blog]/(posts) pages
			post?: ReturnType<typeof preparePageData>['post'];
			supportedLanguages?: Language[];
		}

		interface Platform {
			context: {
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				waitUntil(promise: Promise<any>): void;
			};
			caches: import('@cloudflare/workers-types').CacheStorage & {
				default: import('@cloudflare/workers-types').Cache;
			};
		}
		// interface Error {}
	}
}

export {};
