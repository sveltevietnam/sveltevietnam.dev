import type { PostSeries } from './types';

export const POST_SERIES = [
	{
		slug: 'behind-the-screen',
		title: 'Behind the Screen',
	},
] as const satisfies PostSeries[];

export function getPostSeriesBySlug(slug: (typeof POST_SERIES)[number]['slug']) {
	return POST_SERIES.find((s) => s.slug === slug);
}
