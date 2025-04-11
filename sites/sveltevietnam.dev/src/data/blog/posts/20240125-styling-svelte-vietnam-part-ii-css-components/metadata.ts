import { defineBlogPostMetadata } from '..';
import * as m from '../../locales/generated/messages';

export default defineBlogPostMetadata((lang) => ({
	slug: m['posts.20240125_styling_svelte_vietnam_ii.slug'](lang),
	title: m['posts.20240125_styling_svelte_vietnam_ii.title'](lang),
	description: m['posts.20240125_styling_svelte_vietnam_ii.desc'](lang),
	keywords: 'tailwindcss, styling, postcss, tailwindcss, design system',
	publishedAt: new Date('2024-01-25'),
	authors: ['vnphanquang'],
	categories: ['insider', 'ecosystem'],
	series: ['styling-svelte-vietnam', 'behind-the-screen'],
	...(
		{
			en: {
				readMinutes: 12,
				numWords: 1900,
				translation: 'manual',
			},
			vi: {
				readMinutes: 12,
				numWords: 2400,
				translation: 'original',
			},
		} as const
	)[lang],
}));
