import type { LANGUAGES } from '$shared/constants';

export type ColorScheme = 'light' | 'dark' | 'system';
export type Language = (typeof LANGUAGES)[number];
