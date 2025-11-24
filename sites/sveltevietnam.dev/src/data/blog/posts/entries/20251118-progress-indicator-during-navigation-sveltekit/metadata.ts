import { defineBlogPostMetadata } from '..';

export default defineBlogPostMetadata((lang) => ({
	publishedAt: new Date('2025-11-18'),
	authors: ['vnphanquang'],
	categories: ['svelte-and-kit'],
	series: ['mini-snippet'],
	outdate: 0,
	...(
		{
			en: {
				slug: '20251118-progress-indicator-during-navigation-sveltekit',
				title: 'Pattern via Example: SvelteKit Navigation Progress Indicator',
				description:
					'A practical example that illustrates use case for the `#await` syntax, Svelte context, and passing reactive state into functions',
				keywords:
					'context, reactivity, await, function, navigation, progress indicator, loader, system visibility, feedback, ux',
				translation: 'original',
				readMinutes: 0,
				numWords: 0,
			},
			vi: {
				slug: '20251118-chi-thi-trang-thai-chuyen-trang-sveltekit',
				title: 'Chỉ thị trạng thái trong khi chuyển trang với SvelteKit',
				description:
					'Ví dụ thực tế cho cú pháp #await và giải pháp đóng gói reactivity bằng context',
				keywords: 'context, reactivity, await, điều hướng, chỉ thị trạng thái, giao diện chờ, ux',
				translation: 'manual',
				readMinutes: 0,
				numWords: 0,
			},
		} as const
	)[lang],
}));
