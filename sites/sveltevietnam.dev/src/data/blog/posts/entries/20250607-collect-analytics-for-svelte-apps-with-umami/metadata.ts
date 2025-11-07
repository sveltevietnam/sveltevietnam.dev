import { defineBlogPostMetadata } from '..';

export default defineBlogPostMetadata((lang) => ({
	publishedAt: new Date('2025-06-07'),
	authors: ['vnphanquang'],
	categories: ['ecosystem'],
	series: ['mini-snippet'],
	outdate: 365 * 2, // 2 year in days
	...(
		{
			en: {
				slug: '20250607-collect-analytics-for-svelte-apps-with-umami',
				title: 'Collect Analytics for Svelte Apps with Umami - An overview',
				description:
					'Integrate Umami with Svelte in just a few minutes — a modern & privacy-friendly alternative to Google Analytics',
				keywords: 'analytics, umami, privacy, integration',
				translation: 'manual',
				readMinutes: 4,
				numWords: 600,
			},
			vi: {
				slug: '20250607-thu-thap-du-lieu-trong-ung-dung-svelte-voi-umami',
				title: 'Thu thập dữ liệu trong ứng dụng Svelte với Umami',
				description:
					'Sơ lược về tích hợp Umami vào Svelte trong vài phút — một giải pháp thay thế cho Google Analytics',
				keywords: 'thu thập dữ liệu, umami, quyền riêng tư, tích hợp',
				translation: 'original',
				readMinutes: 4,
				numWords: 700,
			},
		} as const
	)[lang],
}));
