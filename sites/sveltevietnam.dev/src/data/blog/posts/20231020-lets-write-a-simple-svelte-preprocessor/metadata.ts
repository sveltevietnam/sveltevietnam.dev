import { defineBlogPostMetadata } from '..';
import * as m from '../../locales/generated/messages';

export default defineBlogPostMetadata((lang) => ({
	slug: m['posts.20231020_preprocessor.slug'](lang),
	title: m['posts.20231020_preprocessor.title'](lang),
	description: m['posts.20231020_preprocessor.desc'](lang),
	keywords: 'preprocessor',
	publishedAt: new Date('2023-10-20'),
	authors: ['vnphanquang'],
	categories: ['svelte-and-kit'],
	...(
		{
			en: {
				readMinutes: 12,
				numWords: 1720,
				translation: 'manual',
			},
			vi: {
				readMinutes: 12,
				numWords: 2060,
				translation: 'original',
			},
		} as const
	)[lang],
}));
