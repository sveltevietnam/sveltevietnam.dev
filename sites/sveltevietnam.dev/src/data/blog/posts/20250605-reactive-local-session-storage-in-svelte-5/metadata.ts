import { defineBlogPostMetadata } from '..';

export default defineBlogPostMetadata((lang) => ({
	publishedAt: new Date('2025-06-05'),
	authors: ['vnphanquang'],
	categories: ['svelte-and-kit'],
	series: ['mini-snippet'],
	outdate: 365 * 2, // 2 year in days
	...(
		{
			en: {
				slug: '20250605-reactive-local-session-storage-in-svelte-5',
				title: 'Reactive Local/Session Storage in Svelte 5',
				description: 'Crafting reactive web storage with Svelte createSubscriber API',
				keywords: 'createsubscriber, web storage, localstorage, sessionstorage, reactivity',
				translation: 'manual',
				readMinutes: 5,
				numWords: 1000,
			},
			vi: {
				slug: '20250605-reactive-local-session-storage-trong-svelte-5',
				title: 'Reactive Local/Session Storage trong Svelte 5',
				description: 'Tạo web storage có sẵn tính reactivity bằng API reateSubscriber từ Svelte',
				keywords: 'createsubscriber, web storage, localstorage, sessionstorage, reactivity',
				translation: 'original',
				readMinutes: 5,
				numWords: 1100,
			},
		} as const
	)[lang],
}));
