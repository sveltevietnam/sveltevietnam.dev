import type { PostSeries } from './types';

export const BEHIND_THE_SCREEN = {
	slug: 'behind-the-screen',
	title: 'Behind the Screen',
} satisfies PostSeries;

export const STYLING_SVELTE_VIETNAM = {
	slug: 'styling-svelte-vietnam',
	title: {
		en: 'Styling Svelte Vietnam',
		vi: 'Styling cho Svelte Việt Nam',
	},
} satisfies PostSeries;

export const POST_SERIES = [
	BEHIND_THE_SCREEN,
	STYLING_SVELTE_VIETNAM,
] as const satisfies PostSeries[];

export function getPostSeriesBySlug(slug: (typeof POST_SERIES)[number]['slug']) {
	return POST_SERIES.find((s) => s.slug === slug);
}
