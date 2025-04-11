import { defineBlogPostMetadata } from '..';
import * as m from '../../locales/generated/messages';

export default defineBlogPostMetadata((lang) => ({
	slug: m['posts.20240414_svelte_action.slug'](lang),
	title: m['posts.20240414_svelte_action.title'](lang),
	description: m['posts.20240414_svelte_action.desc'](lang),
	keywords: 'action, runtime, compile-time, DOM, javascript',
	publishedAt: new Date('2024-04-14'),
	authors: ['vnphanquang'],
	categories: ['svelte-and-kit'],
	series: ['styling-svelte-vietnam', 'behind-the-screen'],
	...(
		{
			en: {
				readMinutes: 8,
				numWords: 1600,
				translation: 'manual',
			},
			vi: {
				readMinutes: 8,
				numWords: 1900,
				translation: 'original',
			},
		} as const
	)[lang],
}));

