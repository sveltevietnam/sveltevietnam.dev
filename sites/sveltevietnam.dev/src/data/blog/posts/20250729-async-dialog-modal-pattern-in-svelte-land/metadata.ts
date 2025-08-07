import { defineBlogPostMetadata } from '..';

export default defineBlogPostMetadata((lang) => ({
	publishedAt: new Date('2025-07-29'),
	authors: ['vnphanquang'],
	categories: ['svelte-and-kit'],
	series: ['mini-snippet'],
	outdate: 365 * 2, // 2 year in days
	...(
		{
			en: {
				slug: '20250729-async-dialog-modal-pattern-in-svelte-land',
				title: 'Async Dialog/Modal Pattern in Svelte Land',
				description:
					'Call and await any component as dialog / modal programmatically in one seamless flow',
				keywords: 'dialog, modal, async, await, type-safe, portal, svelte-put, async-stack',
				translation: 'manual',
				readMinutes: 10,
				numWords: 1000,
			},
			vi: {
				slug: '20250729-su-dung-hop-thoai-async-trong-svelte',
				title: 'Sử dụng hộp thoại async trong Svelte',
				description: 'Gọi và chờ kết quả từ hộp thoại bằng Javascript với bất cứ component nào',
				keywords: 'dialog, modal, hộp thoại, async, await, svelte-put, async-stack',
				translation: 'original',
				readMinutes: 10,
				numWords: 1000,
			},
		} as const
	)[lang],
}));
