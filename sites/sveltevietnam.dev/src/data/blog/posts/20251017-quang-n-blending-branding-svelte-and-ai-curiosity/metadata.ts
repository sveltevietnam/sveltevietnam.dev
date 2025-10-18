import { defineBlogPostMetadata } from '..';

export default defineBlogPostMetadata((lang) => ({
	publishedAt: new Date('2025-10-17'),
	authors: ['abc'],
	categories: ['community'],
	series: ['people-of-svelte'],
	outdate: 0,
	...(
		{
			en: {
				slug: '20251017-quang-n-blending-branding-svelte-and-ai-curiosity',
				title: 'Quang N.: Blending Branding, Svelte, and AI Curiosity',
				description:
					'Quang is a design engineer exploring the space between branding, Svelte, and AI. Calm on the outside but endlessly curious within, he’s blending design and technology to create something uniquely',
				keywords: 'design, ai',
				translation: 'original',
				// TODO: update these information once you finish writing
				readMinutes: 2,
				numWords: 399,
			},
			vi: {
				slug: '20251017-quang-n-khi-thuong-hieu-svelte-va-ai-gap-nhau',
				title: 'Quang N.: Khi thiết kế thương hiệu, Svelte và AI gặp nhau',
				description:
					'Quang là một kĩ sư thiết kế với sở thích kết hợp giữa branding, Svelte và AI. Vẻ ngoài điềm tĩnh, luôn nung nấu nhiều ý tưởng. Quang thích kết hợp thiết kế và công nghệ để tạo nên điều gì đó đặc biệt.',
				keywords: 'thiết kế, ai',
				translation: 'manual',
				// TODO: update these information once you finish writing
				readMinutes: 2,
				numWords: 399,
			},
		} as const
	)[lang],
}));
