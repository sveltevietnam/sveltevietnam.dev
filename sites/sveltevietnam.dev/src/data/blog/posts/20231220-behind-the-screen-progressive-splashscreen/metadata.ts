import { defineBlogPostMetadata } from '..';

export const en = defineBlogPostMetadata({
	slug: '20231220-behind-the-screen-progressive-splashscreen',
	title: 'Progressive Splash Screen',
	description:
		'Implement an progressively enhanced splash screen for sveltevietnam.dev - an expression of creativity with unexpected benefits',
	publishedAt: new Date('2023-12-20'),
	authors: ['vnphanquang'],
	categories: ['insider', 'svelte-and-kit'],
	keywords: 'splashscreen, progressive enhancement, ux, animation',
	readMinutes: 12,
	numWords: 2300,
	translation: 'manual',
	series: ['behind-the-screen'],
});

export const vi = defineBlogPostMetadata({
	slug: '20231220-behind-the-screen-man-hinh-cho-voi-nang-cao-tang-dan',
	title: 'Màn hình chờ với nâng cao tăng dần',
	description:
		'Thiết lập màn hình chờ cho sveltevietnam.dev, cải thiện trải nghiệm người dùng với nhiều lợi ích bất ngờ',
	publishedAt: new Date('2023-12-20'),
	authors: ['vnphanquang'],
	categories: ['insider', 'svelte-and-kit'],
	keywords: 'splashscreen, progressive enhancement, ux, animation',
	readMinutes: 12,
	numWords: 2900,
	translation: 'original',
	series: ['behind-the-screen'],
});
