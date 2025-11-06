import { defineBlogPostMetadata } from '..';

export default defineBlogPostMetadata((lang) => ({
	publishedAt: new Date('2025-11-05'),
	authors: ['vnphanquang'],
	categories: ['svelte-and-kit'],
	series: [],
	...(
		{
			en: {
				slug: '20251105-internationalisation-with-remote-function-a-proof-of-concept',
				title: 'Internationalisation with Remote Function — A Proof of Concept',
				description:
					'Composable and minimal i18n solution in Svelte land, built on remote function and vite plugin',
				keywords: 'i18n, translation, remote function, esm, treeshaking, poc',
				translation: 'manual',
				readMinutes: 10,
				numWords: 1400,
			},
			vi: {
				slug: '20251105-thu-nghiem-giai-phap-da-ngon-ngu-voi-remote-function',
				title: 'Thử nghiệm giải pháp đa ngôn ngữ với remote function',
				description:
					'Xây dựng i18n tối giản và linh hoạt cho ứng dụng Svelte trên nền tảng remote function và vite plugin',
				keywords: 'i18n, đa ngôn ngữ, remote function, esm, treeshaking',
				translation: 'original',
				readMinutes: 10,
				numWords: 1600,
			},
		} as const
	)[lang],
}));
