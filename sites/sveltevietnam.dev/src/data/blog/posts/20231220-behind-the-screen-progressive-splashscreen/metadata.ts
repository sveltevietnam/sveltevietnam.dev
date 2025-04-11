import { defineBlogPostMetadata } from '..';
import * as m from '../../locales/generated/messages';

export default defineBlogPostMetadata((lang) => ({
	slug: m['posts.20231220_progressive_splashscreen.slug'](lang),
	title: m['posts.20231220_progressive_splashscreen.title'](lang),
	description: m['posts.20231220_progressive_splashscreen.desc'](lang),
	keywords: 'splashscreen, progressive enhancement, ux, animation',
	publishedAt: new Date('2023-12-20'),
	authors: ['vnphanquang'],
	categories: ['insider', 'svelte-and-kit'],
	series: ['behind-the-screen'],
	...(
		{
			en: {
				readMinutes: 12,
				numWords: 2300,
				translation: 'manual',
			},
			vi: {
				readMinutes: 12,
				numWords: 2900,
				translation: 'original',
			},
		} as const
	)[lang],
}));
