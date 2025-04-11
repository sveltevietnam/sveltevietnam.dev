import { defineBlogPostMetadata } from '..';
import * as m from '../../locales/generated/messages';

export default defineBlogPostMetadata((lang) => ({
	slug: m['posts.20240420_come_and_stay.slug'](lang),
	title: m['posts.20240420_come_and_stay.title'](lang),
	description: m['posts.20240420_come_and_stay.desc'](lang),
	keywords: m['posts.20240420_come_and_stay.keywords'](lang),
	publishedAt: new Date('2024-04-20'),
	authors: ['vnphanquang'],
	categories: ['svelte-and-kit', 'ecosystem'],
	...(
		{
			en: {
				readMinutes: 8,
				numWords: 1590,
				translation: 'manual',
			},
			vi: {
				readMinutes: 8,
				numWords: 1990,
				translation: 'original',
			},
		} as const
	)[lang],
}));
