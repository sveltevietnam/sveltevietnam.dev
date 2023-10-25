import { getContext, setContext } from 'svelte';
import { writable } from 'svelte/store';

import { browser } from '$app/environment';

const SPLASH_CONTEXT_ID = 'splash';

type SplashStoreValue = {
  done: boolean;
};

function createSplashStore() {
  const store = writable<SplashStoreValue>({ done: false });

  if (browser) {
    document.documentElement.toggleAttribute('data-hydrated', true);

    const splashEl = document.getElementById('splash');
    if (splashEl) {
      if (document.documentElement.hasAttribute('data-splashed')) {
        store.set({ done: true });
      } else {
        const intervalId = setInterval(() => {
          if (document.documentElement.hasAttribute('data-splashed')) {
            store.set({ done: true });
            splashEl.remove();
            clearInterval(intervalId);
          }
        }, 500);
      }
    }
  }

  return { subscribe: store.subscribe };
}

export function setSplashContext() {
  return setContext(SPLASH_CONTEXT_ID, createSplashStore());
}

export function getSplashContext() {
  return getContext<ReturnType<typeof setSplashContext>>(SPLASH_CONTEXT_ID);
}
