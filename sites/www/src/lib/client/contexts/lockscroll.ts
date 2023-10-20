import { getContext, setContext } from 'svelte';
import { writable } from 'svelte/store';

const LOCK_SCROLL_CONTEXT_ID = 'lockscroll';

export function setLockScrollContext() {
  const lockScrollStore = writable(false);
  return setContext(LOCK_SCROLL_CONTEXT_ID, lockScrollStore);
}

export function getLockScrollContext() {
  return getContext<ReturnType<typeof setLockScrollContext>>(LOCK_SCROLL_CONTEXT_ID);
}
