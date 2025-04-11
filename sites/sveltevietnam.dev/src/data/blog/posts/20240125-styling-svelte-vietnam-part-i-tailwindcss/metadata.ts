import { defineBlogPostMetadata } from '..';
import * as m from '../../locales/generated/messages';

export default defineBlogPostMetadata((lang) => ({
	slug: m['posts.20240125_styling_svelte_vietnam_i.slug'](lang),
	title: m['posts.20240125_styling_svelte_vietnam_i.title'](lang),
	description: m['posts.20240125_styling_svelte_vietnam_i.desc'](lang),
	keywords: 'tailwindcss, styling, postcss, tailwindcss, design system',
	publishedAt: new Date('2024-01-25'),
	authors: ['vnphanquang'],
	categories: ['insider', 'ecosystem'],
	series: ['styling-svelte-vietnam', 'behind-the-screen'],
	...(
		{
			en: {
				readMinutes: 10,
				numWords: 2000,
				translation: 'manual',
			},
			vi: {
				readMinutes: 10,
				numWords: 2300,
				translation: 'original',
			},
		} as const
	)[lang],
}));

