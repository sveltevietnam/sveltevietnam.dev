import { defineBlogPostMetadata } from '..';

export default defineBlogPostMetadata((lang) => ({
	keywords: 'preprocessor',
	publishedAt: new Date('2023-10-20'),
	authors: ['vnphanquang'],
	categories: ['svelte-and-kit'],
	...(
		{
			en: {
				slug: '20231020-lets-write-a-simple-svelte-preprocessor',
				title: "Let's Write a Simple Svelte Preprocessor",
				description:
					"Introducing the Svelte preprocessor API via analysis of a practical, simple use case and one possible minimal solution. If you haven't written a preprocessor before, it's time!",
				readMinutes: 12,
				numWords: 1720,
				translation: 'manual',
			},
			vi: {
				slug: '20231020-viet-mot-svelte-preprocessor-don-gian',
				title: 'Viết một Svelte preprocessor đơn giản',
				description:
					'Giới thiệu sơ bộ cách hoạt động của Svelte preprocessor bằng cách phân tích một vấn đề thường gặp và tìm phương án giải quyết tối giản nhất',
				readMinutes: 12,
				numWords: 2060,
				translation: 'original',
			},
		} as const
	)[lang],
}));
