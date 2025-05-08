import { defineBlogPostMetadata } from '..';

export default defineBlogPostMetadata((lang) => ({
	publishedAt: new Date('2023-10-12'),
	authors: ['vnphanquang'],
	categories: ['community', 'insider'],
	...(
		{
			en: {
				slug: '20231012-svelte-vietnam-from-local-to-global',
				title: 'Svelte Vietnam: from Local to Global',
				description:
					"What is Svelte Vietnam? How does it come about? Why is it even necessary? Let's get to the bottom of these questions in this blog post.",
				keywords: 'identity, community',
				readMinutes: 10,
				numWords: 1540,
				translation: 'manual',
			},
			vi: {
				slug: '20231012-svelte-viet-nam-tu-vuon-nha-vuon-ra-the-gioi',
				title: 'Svelte Việt Nam: từ vườn nhà vươn ra thế giới',
				description:
					'Svelte Việt Nam là gì, khởi đầu từ đâu, vì sao cần phải có? Hãy cùng tìm câu trả lời trong bài viết này.',
				keywords: 'danh tính, cộng đồng',
				readMinutes: 10,
				numWords: 1950,
				translation: 'original',
			},
		} as const
	)[lang],
}));
