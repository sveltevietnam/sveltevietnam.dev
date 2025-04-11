import { defineBlogPostMetadata } from '..';
import * as m from '../../locales/generated/messages';

export default defineBlogPostMetadata((lang) => ({
	slug: m['posts.20231204_secrets.slug'](lang),
	title: m['posts.20231204_secrets.title'](lang),
	description: m['posts.20231204_secrets.desc'](lang),
	keywords: m['posts.20231204_secrets.keywords'](lang),
	publishedAt: new Date('2023-12-04'),
	authors: ['vnphanquang'],
	categories: ['insider'],
	series: ['behind-the-screen'],
	...(
		{
			en: {
				readMinutes: 8,
				numWords: 1890,
				translation: 'manual',
			},
			vi: {
				readMinutes: 10,
				numWords: 2460,
				translation: 'original',
			},
		} as const
	)[lang],
}));
