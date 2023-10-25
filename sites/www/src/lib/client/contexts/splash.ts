import { getContext, setContext } from 'svelte';
import { writable } from 'svelte/store';

import { browser } from '$app/environment';

const SPLASH_CONTEXT_ID = 'splash';
const HYDRATED_AT_ATTRIBUTE = 'data-hydrated-at';
const SPLASHED_AT_ATTRIBUTE = 'data-splashed-at';

type SplashStoreValue = {
  done: boolean;
  isSlowHydration: boolean;
};

function createSplashStore() {
  const store = writable<SplashStoreValue>({ done: false, isSlowHydration: false });

  function splash(splashedAt: Date, hydratedAt: Date) {
    store.set({
      done: true,
      isSlowHydration: hydratedAt.getTime() - splashedAt.getTime() > 2000,
    });
  }

  if (browser) {
    const hydratedAt = new Date();
    document.documentElement.setAttribute(HYDRATED_AT_ATTRIBUTE, hydratedAt.toISOString());

    let splashedAt = document.documentElement.getAttribute(SPLASHED_AT_ATTRIBUTE);
    if (splashedAt) {
      splash(new Date(splashedAt), hydratedAt);
    } else {
      const intervalId = setInterval(() => {
        splashedAt = document.documentElement.getAttribute(SPLASHED_AT_ATTRIBUTE);
        if (splashedAt) {
          clearInterval(intervalId);
          splash(new Date(splashedAt), hydratedAt);
        }
      }, 500);
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
