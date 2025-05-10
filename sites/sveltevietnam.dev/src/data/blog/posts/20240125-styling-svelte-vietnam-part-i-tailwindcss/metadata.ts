import { defineBlogPostMetadata } from '..';

export default defineBlogPostMetadata((lang) => ({
	keywords: 'tailwindcss, styling, postcss, tailwindcss, design system',
	publishedAt: new Date('2024-01-25'),
	authors: ['vnphanquang'],
	categories: ['insider', 'ecosystem'],
	series: ['styling-svelte-vietnam', 'behind-the-screen'],
	...(
		{
			en: {
				slug: '20240125-styling-svelte-vietnam-part-i-tailwindcss',
				title: 'Part I - TailwindCSS',
				description:
					"Let's talk about TailwindCSS, its benefits and the criticism, along with the practicality and flexibility it brings to the sveltevietnam.dev project",
				readMinutes: 10,
				numWords: 2000,
				translation: 'manual',
			},
			vi: {
				slug: '20240125-styling-cho-svelte-viet-nam-phan-i-tailwindcss',
				title: 'Phần I - TailwindCSS',
				description:
					'Bàn về TailwindCSS, lợi ích và phê phán, tính thực dụng và sự linh hoạt mang lại cho dự án sveltevietnam.dev',
				readMinutes: 10,
				numWords: 2300,
				translation: 'original',
			},
		} as const
	)[lang],
}));
