/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-empty-object-type */
/// <reference types="vite/client" />
/// <reference types="umami-browser" />

import type { AppLocals, AppPlatform } from '@sveltevietnam/kit';

declare global {
	// @ts-expect-error
	declare module '*&imagetools' {
		// @ts-expect-error
		export default import('vite-imagetools').Picture;
	}

	interface Window {
		umami?: umami.umami;
	}

	namespace App {
		interface Locals extends AppLocals {}
		interface Platform extends AppPlatform {}
	}
}

export {};
