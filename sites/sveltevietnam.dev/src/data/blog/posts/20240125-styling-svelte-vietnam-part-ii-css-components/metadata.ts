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
				slug: '20240125-styling-svelte-vietnam-part-ii-css-components',
				title: 'Part II - CSS Components',
				description:
					'Introduce the "CSS component" approach in the age of Javascript, built on dated but invaluable experience from the early decades of the web platform',
				readMinutes: 12,
				numWords: 1900,
				translation: 'manual',
			},
			vi: {
				slug: '20240125-styling-cho-svelte-viet-nam-phan-ii-css-components',
				title: 'Phần II - CSS Component',
				description:
					'Giới thiệu tư duy "CSS component" trong thời đại Javascript, xây dựng trên những kinh nghiệm cũ kĩ nhưng đầy giá trị từ những thập kỉ đầu của nền tảng web',
				readMinutes: 12,
				numWords: 2400,
				translation: 'original',
			},
		} as const
	)[lang],
}));
