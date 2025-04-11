import { defineBlogPostMetadata } from '..';
import * as m from '../../locales/generated/messages';

export default defineBlogPostMetadata((lang) => ({
	slug: m['posts.20231012_local_to_global.slug'](lang),
	title: m['posts.20231012_local_to_global.title'](lang),
	description: m['posts.20231012_local_to_global.desc'](lang),
	keywords: m['posts.20231012_local_to_global.keywords'](lang),
	publishedAt: new Date('2023-10-12'),
	authors: ['vnphanquang'],
	categories: ['community', 'insider'],
	...(
		{
			en: {
				readMinutes: 10,
				numWords: 1540,
				translation: 'manual',
			},
			vi: {
				readMinutes: 10,
				numWords: 1950,
				translation: 'original',
			},
		} as const
	)[lang],
}));
