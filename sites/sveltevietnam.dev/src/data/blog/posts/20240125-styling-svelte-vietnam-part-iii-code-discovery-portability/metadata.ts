import { defineBlogPostMetadata } from '..';
import * as m from '../../locales/generated/messages';

export default defineBlogPostMetadata((lang) => ({
	slug: m['posts.20240125_styling_svelte_vietnam_iii.slug'](lang),
	title: m['posts.20240125_styling_svelte_vietnam_iii.title'](lang),
	description: m['posts.20240125_styling_svelte_vietnam_iii.desc'](lang),
	keywords: 'tailwindcss, styling, postcss, component, design system',
	publishedAt: new Date('2024-01-25'),
	authors: ['vnphanquang'],
	categories: ['insider', 'ecosystem'],
	series: ['styling-svelte-vietnam', 'behind-the-screen'],
	...(
		{
			en: {
				readMinutes: 9,
				numWords: 1800,
				translation: 'manual',
			},
			vi: {
				readMinutes: 9,
				numWords: 2300,
				translation: 'original',
			},
		} as const
	)[lang],
}));
