import { defineBlogPostMetadata } from '..';

export default defineBlogPostMetadata((lang) => ({
	keywords: 'tailwindcss, styling, postcss, component, design system',
	publishedAt: new Date('2024-01-25'),
	authors: ['vnphanquang'],
	categories: ['insider', 'ecosystem'],
	series: ['styling-svelte-vietnam', 'behind-the-screen'],
	...(
		{
			en: {
				slug: '20240125-styling-svelte-vietnam-part-iii-code-discovery-portability',
				title: 'Part III - Code Discovery & Portability',
				description:
					'Apply the "CSS Component" approach into Tailwind and the PostCSS ecosystem for building minimal and flexible design systems',
				readMinutes: 9,
				numWords: 1800,
				translation: 'manual',
			},
			vi: {
				slug: '20240125-styling-cho-svelte-viet-nam-phan-iii-kham-pha-va-tai-su-dung-ma-nguon',
				title: 'Phần III - khám phá và tái sử dụng mã nguồn',
				description:
					'Kết hợp Tailwind và hệ sinh thái PostCSS với ý tưởng CSS Component để xây dựng hệ thống thiết kế tối giản và linh hoạt',
				readMinutes: 9,
				numWords: 2300,
				translation: 'original',
			},
		} as const
	)[lang],
}));
