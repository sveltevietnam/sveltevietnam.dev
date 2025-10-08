/// <reference types="umami-browser" />
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
		// eslint-disable-next-line @typescript-eslint/no-empty-object-type
		interface Locals extends AppLocals {}

		interface PageData {
			editUrl?: string;
			routing?: {
				breadcrumbs?: {
					path: string;
					name: string;
				}[];
				paths: Record<import('@sveltevietnam/i18n').Language, string>;
			};
			/**
			 * per-page page metadata setup
			 * {@see $routes/[lang]/+layout.svelte} for defaults
			 */
			meta?: PageMetadata;
		}

		// interface PageState {}

		interface Platform extends AppPlatform {
			env?: {
				backend: import('@sveltevietnam/backend').default;
			};
		}

		interface Error {
			code: string;
		}
	}
}

export {};
