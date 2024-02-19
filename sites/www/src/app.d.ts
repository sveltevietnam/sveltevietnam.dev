/// <reference types="@sveltejs/kit" />
/// <reference types="svelte" />
/// <reference types="vite/client" />
/// <reference types="@sveltejs/adapter-cloudflare" />

import type { COLOR_SCHEMES, STATUSES } from '$lib/constants';
import type { preparePageData } from '$lib/data/blog';

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
		declare type Language = import('@internals/utils/language').Language;
		declare type Settings = {
			language: Language;
			colorScheme: ColorScheme;
			splash: 'short' | 'long' | 'random' | 'disabled';
			accessibility: {
				reduceMotion: boolean;
			};
		};

		interface Locals {
			userId: string;
			version: string;
			internalReferer?: URL;
			settings: Settings;
		}
		interface PageData {
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

		interface Error {
			code: string;
		}
	}
}

export {};
