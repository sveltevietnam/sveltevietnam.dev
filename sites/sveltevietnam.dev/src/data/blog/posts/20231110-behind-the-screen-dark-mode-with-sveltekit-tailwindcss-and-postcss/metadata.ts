import { defineBlogPostMetadata } from '..';
import * as m from '../../locales/generated/messages';

export default defineBlogPostMetadata((lang) => ({
	slug: m['posts.20231110_dark_mode.slug'](lang),
	title: m['posts.20231110_dark_mode.title'](lang),
	description: m['posts.20231110_dark_mode.desc'](lang),
	keywords: 'postcss, color scheme, cookie, vanilla, dark mode',
	publishedAt: new Date('2023-11-10'),
	authors: ['vnphanquang'],
	categories: ['insider', 'svelte-and-kit', 'ecosystem'],
	series: ['behind-the-screen'],
	...(
		{
			en: {
				readMinutes: 18,
				numWords: 2970,
				translation: 'manual',
			},
			vi: {
				readMinutes: 18,
				numWords: 3500,
				translation: 'original',
			},
		} as const
	)[lang],
}));
