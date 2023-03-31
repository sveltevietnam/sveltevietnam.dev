import { browser } from '$app/environment';

/**
 * requires `window.matchMedia` (only in browser context)
 * @returns user's color scheme preference
 */
export function getPrefersColorScheme() {
  if (!browser) return 'light';
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}
