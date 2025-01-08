import { defineBlogPostMetadata } from '..';

export const en = defineBlogPostMetadata({
	slug: '20240125-styling-svelte-vietnam-part-ii-css-components',
	title: 'Part II - CSS Components',
	description:
		'Introduce the "CSS component" approach in the age of Javascript, built on dated but invaluable experience from the early decades of the web platform',
	publishedAt: new Date('2024-01-25'),
	authors: ['vnphanquang'],
	categories: ['insider', 'ecosystem'],
	keywords: 'tailwindcss, styling, postcss, tailwindcss, design system',
	readMinutes: 12,
	numWords: 1900,
	translation: 'manual',
	series: ['styling-svelte-vietnam', 'behind-the-screen'],
});

export const vi = defineBlogPostMetadata({
	slug: '20240125-styling-cho-svelte-viet-nam-phan-ii-css-components',
	title: 'Phần II - CSS Component',
	description:
		'Giới thiệu tư duy "CSS component" trong thời đại Javascript, xây dựng trên những kinh nghiệm cũ kĩ nhưng đầy giá trị từ những thập kỉ đầu của nền tảng web',
	publishedAt: new Date('2024-01-25'),
	authors: ['vnphanquang'],
	categories: ['insider', 'ecosystem'],
	keywords: 'tailwindcss, styling, postcss, tailwindcss, design system',
	readMinutes: 12,
	numWords: 2400,
	translation: 'original',
	series: ['styling-svelte-vietnam', 'behind-the-screen'],
});
