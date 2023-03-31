/// <reference types="@sveltejs/kit" />
/// <reference types="svelte" />
/// <reference types="vite/client" />
/// <reference types="@types/gtag.js" />

import type { Language } from '$shared/services/i18n';
import type { ColorScheme } from '$shared/types';

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
// and what to do when importing types
declare global {
  declare const __BUILD_TIMESTAMP__: string;
  declare const __BUILD_HASH__: string;
  declare const __BUILD_VERSION__: string;

  namespace App {
    interface Locals {
      userId: string;
      colorScheme: ColorScheme;
      language: Language;
    }
    interface PageData {
      colorScheme: ColorScheme;
      language: Language;
      meta?: {
        title?: string;
        description?: string;
        keywords?: string[];
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
          img?: string;
          imageAlt?: string;
          site?: string;
        };
      };
    }

    // cloudflare
    interface Platform {
      env: {
        //
      };
      context: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        waitUntil(promise: Promise<any>): void;
      };
      caches: CacheStorage & { default: Cache };
    }

    // interface Error {}
  }
}
