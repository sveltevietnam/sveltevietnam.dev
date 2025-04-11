import { defineBlogPostMetadata } from '..';
import * as m from '../../locales/generated/messages';

export default defineBlogPostMetadata((lang) => ({
	slug: m['posts.20231009_yes_code_blog.slug'](lang),
	title: m['posts.20231009_yes_code_blog.title'](lang),
	description: m['posts.20231009_yes_code_blog.desc'](lang),
	keywords: 'blog',
	publishedAt: new Date('2023-10-09'),
	authors: ['vnphanquang'],
	categories: ['insider'],
	series: ['behind-the-screen'],
	...(
		{
			en: {
				readMinutes: 11,
				numWords: 1630,
				translation: 'manual',
			},
			vi: {
				readMinutes: 11,
				numWords: 2130,
				translation: 'original',
			},
		} as const
	)[lang],
}));
