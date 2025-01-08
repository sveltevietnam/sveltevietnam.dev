import { defineBlogPostMetadata } from '..';

export const en = defineBlogPostMetadata({
	slug: '20231009-behind-the-screen-a-yes-code-blog-of-svelte-vietnam',
	title: 'A Yes-Code Blog of Svelte Vietnam',
	description:
		'Look behind the curtain and discuss the rationale behind the technical design of the Svelte Vietnam Blog',
	publishedAt: new Date('2023-10-09'),
	authors: ['vnphanquang'],
	categories: ['insider'],
	keywords: 'blog',
	readMinutes: 11,
	numWords: 1630,
	translation: 'manual',
});

export const vi = defineBlogPostMetadata({
	slug: '20231009-behind-the-screen-blog-chay-bang-com-va-code',
	title: 'Blog chạy bằng cơm (và code)',
	description:
		'Sơ lược về những quyết định và thiết kế đằng sau hạ tầng của trang Blog Svelte Việt Nam',
	publishedAt: new Date('2023-10-09'),
	authors: ['vnphanquang'],
	categories: ['insider'],
	keywords: 'blog',
	readMinutes: 11,
	numWords: 2130,
	translation: 'original',
});
