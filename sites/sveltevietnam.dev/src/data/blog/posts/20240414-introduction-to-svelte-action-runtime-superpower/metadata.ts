import { defineBlogPostMetadata } from '..';

export default defineBlogPostMetadata((lang) => ({
	publishedAt: new Date('2024-04-14'),
	authors: ['vnphanquang'],
	categories: ['svelte-and-kit'],
	series: ['styling-svelte-vietnam', 'behind-the-screen'],
	outdate: 365, // 1 year in days
	...(
		{
			en: {
				slug: '20240414-introduction-to-svelte-action-runtime-superpower',
				title: 'Introduction to Svelte Action: Runtime Superpower',
				description:
					'A tour of what Svelte action is capable of and how to write your own to enhance applications and handle user interactions at runtime',
				readMinutes: 8,
				numWords: 1600,
				translation: 'manual',
			},
			vi: {
				slug: '20240414-kham-pha-suc-manh-cua-svelte-action-tai-runtime',
				title: 'Khám phá sức mạnh của Svelte Action tại runtime',
				description:
					'Tổng quan về tính ứng dụng và cách triển khai Svelte action để nâng cao tính năng và xử lý tương tác người dùng tại runtime',
				readMinutes: 8,
				numWords: 1900,
				translation: 'original',
			},
		} as const
	)[lang],
}));
