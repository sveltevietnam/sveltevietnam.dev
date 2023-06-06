/* eslint-disable @typescript-eslint/no-explicit-any */
import { browser } from '$app/environment';

import type { BrowserCacheServiceConstructor } from './browser-cache.class';

export type BrowserCacheDecoratorParams<Data> = {
  key: string;
  storage: 'local' | 'session' | Storage;
  defaultCache: Data;
};

// FIXME: current strategy relies on Stage 2 decorators proposal
// and the Typescript --experimentalDecorators flag
// Keep an eye for docs on https://devblogs.microsoft.com/typescript/announcing-typescript-5-0/#decorators
// and refactor to Stage 3 implementation when it's stable
export function BrowserCache<Data>(params: BrowserCacheDecoratorParams<Data>) {
  const { key, storage, defaultCache } = params;

  return function <C extends BrowserCacheServiceConstructor<Data>>(constructor: C) {
    return class extends constructor {
      constructor(...args: any[]) {
        super(...args);

        if (browser) {
          if (defaultCache && this.get() === null) {
            this.set(defaultCache);
          }
        }
      }

      public get key() {
        return key;
      }

      public get storage() {
        if (storage === 'local') return localStorage;
        else if (storage === 'session') return sessionStorage;
        return storage;
      }
    };
  };
}
