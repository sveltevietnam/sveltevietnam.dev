import { defineBlogPostMetadata } from '..';

export default defineBlogPostMetadata((lang) => ({
	publishedAt: new Date('2025-04-25'),
	authors: ['vnphanquang'],
	categories: ['ecosystem', 'svelte-and-kit'],
	series: ['mini-snippet'],
	outdate: 365 * 2, // 2 year in days
	...(
		{
			en: {
				slug: '20250425-mini-snippet-reactive-extension-storage-wxt',
				title: `Reactive Wrapper for WXT Extension Storage with Svelte's createSubscriber`,
				description:
					"Quick share for a use case of Svelte's reactivity in building web extensions with wxt.dev and the extension storage API",
				keywords: 'identity, community',
				readMinutes: 5,
				numWords: 700,
				translation: 'original',
			},
			vi: {
				slug: '20250425-mini-snippet-reactive-extension-storage-wxt',
				title: `Giúp WXT Extension Storage trở nên "reactive" bằng Svelte's createSubscriber`,
				description:
					'Ứng dụng của tính reactivity trong Svelte khi xây dựng web extension bằng wxt.dev và extension storage api',
				keywords: 'reactivity, wxt, web extension, storage, createSubscriber',
				readMinutes: 5,
				numWords: 800,
				translation: 'manual',
			},
		} as const
	)[lang],
}));
