import type { PostSeries } from './types';

export const BEHIND_THE_SCREEN = {
	slug: 'behind-the-screen',
	title: 'Behind the Screen',
} satisfies PostSeries;

export const POST_SERIES = [BEHIND_THE_SCREEN] as const satisfies PostSeries[];

export function getPostSeriesBySlug(slug: (typeof POST_SERIES)[number]['slug']) {
	return POST_SERIES.find((s) => s.slug === slug);
}
