import { readable } from 'svelte/store';

import { browser } from '$app/environment';

type Screen = 'sp' | 'tb' | 'pc';

export function getScreen(): Screen {
  if (!browser) return 'sp';
  const width = window.innerWidth;
  if (width < 767) {
    return 'sp';
  }
  if (width < 1024) {
    return 'tb';
  }
  return 'pc';
}

export const screen = readable<Screen>(getScreen(), (set) => {
  window.addEventListener('resize', () => {
    set(getScreen());
  });
});
