import { defineBlogPostMetadata } from '..';

export default defineBlogPostMetadata((lang) => ({
	publishedAt: new Date('2026-03-22'),
	authors: ['vnphanquang'],
	categories: ['svelte-and-kit', 'ecosystem', 'testing'],
	outdate: 0,
	...(
		{
			en: {
				slug: '20260322-hydration-assertion-in-tests-with-sveltekit-playwright',
				title: 'Hydration Assertion in Tests with SvelteKit & Playwright',
				description:
					'Detect problematic page load early and reduce flakiness by checking and waiting for hydration in Playwright E2E/UAT tests',
				keywords: 'hydration,testing,uat,e2e,qc',
				translation: 'original',
				// TODO: update these information once you finish writing
				readMinutes: 8,
				numWords: 1000,
			},
			vi: {
				slug: '20260322-kiem-thu-hydration-voi-sveltekit-playwright',
				title: 'Kiểm thử hydration với SvelteKit & Playwright',
				description:
					'Phát hiện sớm lỗi tải trang và tăng tính ổn định trong kiểm thử với Playwright và SvelteKit bằng cách chờ hydration',
				keywords: 'hydration,testing,uat,e2e,qc, kiểm thử',
				translation: 'manual',
				// TODO: update these information once you finish writing
				readMinutes: 0,
				numWords: 0,
			},
		} as const
	)[lang],
}));
