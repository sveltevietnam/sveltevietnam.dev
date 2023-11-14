/// <reference types="@sveltejs/kit" />
/// <reference types="svelte" />
/// <reference types="vite/client" />
/// <reference types="@sveltejs/adapter-cloudflare" />

import type { preparePageData } from '$shared/data/blog';
import type { Language } from '$shared/services/i18n';

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
// and what to do when importing types
declare global {
  declare const __BUILD_TIMESTAMP__: string;
  declare type ColorScheme = 'light' | 'dark' | 'system';

  declare module '*?format=webp' {
    const src: string;
    export default src;
  }

  namespace App {
    interface Locals {
      userId: string;
      colorScheme: ColorScheme;
      language: Language;
      version: string;
      referer?: URL;
    }
    interface PageData {
      colorScheme: ColorScheme;
      language: Language;
      meta?: {
        title?: string;
        description?: string;
        keywords?: string[];
        canonical?: string;
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
