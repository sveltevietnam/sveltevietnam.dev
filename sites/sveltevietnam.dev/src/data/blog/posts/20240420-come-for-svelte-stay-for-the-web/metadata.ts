import { defineBlogPostMetadata } from '..';

export default defineBlogPostMetadata((lang) => ({
	publishedAt: new Date('2024-04-20'),
	authors: ['vnphanquang'],
	categories: ['svelte-and-kit', 'ecosystem'],
	...(
		{
			en: {
				slug: '20240420-come-for-svelte-stay-for-the-web',
				title: 'Come for Svelte, Stay for the Web',
				description:
					'Svelte is exceptionally good at staying out of your way, allowing you to focus on building a better web. No one cares about frameworks anyway!',
				keywords: 'web, ecosystem, runtime, compile-time, action',
				readMinutes: 8,
				numWords: 1590,
				translation: 'manual',
			},
			vi: {
				slug: '20240420-den-voi-web-thong-qua-svelte',
				title: 'Đến với web thông qua Svelte',
				description:
					'API của Svelte được thiết kế để thân thiện với các công nghệ và kiến thức nền tảng, giúp bạn dễ dàng tập trung vào việc xây dựng ứng dụng web, thay vì quan tâm đến framework này và nọ.',
				keywords: 'web, hệ sinh thái, runtime, compile-time, action',
				readMinutes: 8,
				numWords: 1990,
				translation: 'original',
			},
		} as const
	)[lang],
}));
