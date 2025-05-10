import { defineBlogPostMetadata } from '..';

export default defineBlogPostMetadata((lang) => ({
	keywords: 'blog',
	publishedAt: new Date('2023-10-09'),
	authors: ['vnphanquang'],
	categories: ['insider'],
	series: ['behind-the-screen'],
	...(
		{
			en: {
				slug: '20231009-behind-the-screen-a-yes-code-blog-of-svelte-vietnam',
				title: 'A Yes-Code Blog of Svelte Vietnam',
				description:
					'Look behind the curtain and discuss the rationale behind the technical design of the Svelte Vietnam Blog',
				readMinutes: 11,
				numWords: 1630,
				translation: 'manual',
			},
			vi: {
				slug: '20231009-behind-the-screen-blog-chay-bang-com-va-code',
				title: 'Blog chạy bằng cơm (và code)',
				description:
					'Sơ lược về những quyết định và thiết kế đằng sau hạ tầng của trang Blog Svelte Việt Nam',
				readMinutes: 11,
				numWords: 2130,
				translation: 'original',
			},
		} as const
	)[lang],
}));
