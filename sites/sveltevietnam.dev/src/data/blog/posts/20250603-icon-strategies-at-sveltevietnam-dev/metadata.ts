import { defineBlogPostMetadata } from '..';

export default defineBlogPostMetadata((lang) => ({
	publishedAt: new Date('2025-06-03'),
	authors: ['vnphanquang'],
	categories: ['ecosystem'],
	series: ['behind-the-screen'],
	keywords: 'icon, svg, css, inline, static, dynamic, iconify, tailwind',
	...(
		{
			en: {
				slug: '20250603-icon-strategies-at-sveltevietnam-dev',
				title: 'Icon strategies at sveltevietnam.dev',
				description:
					'Managing CSS icons with Iconify & Tailwind V4, and SVG icons with @svelte-put/inline-svg in Vite & Svelte apps',
				translation: 'manual',
				readMinutes: 7,
				numWords: 1300,
			},
			vi: {
				slug: '20250603-quan-ly-va-hien-thi-icon-tai-sveltevietnam-dev',
				title: 'Quản lý và hiển thị icon tại sveltevietnam.dev',
				description:
					'Sử dụng Iconify & Tailwind V4 để hiện thị CSS icon, và @svelte-put/inline-svg cho SVG icon trong ứng dụng Vite & Svelte',
				translation: 'original',
				readMinutes: 7,
				numWords: 1400,
			},
		} as const
	)[lang],
}));
