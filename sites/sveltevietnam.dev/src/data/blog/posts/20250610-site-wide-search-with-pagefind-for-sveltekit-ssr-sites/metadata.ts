import { defineBlogPostMetadata } from '..';

export default defineBlogPostMetadata((lang) => ({
	publishedAt: new Date('2025-06-10'),
	authors: ['vnphanquang'],
	categories: ['svelte-and-kit', 'ecosystem'],
	series: ['behind-the-screen'],
	...(
		{
			en: {
				slug: '20250610-site-wide-search-with-pagefind-for-sveltekit-ssr-sites',
				title: 'Site-wide search with Pagefind for SvelteKit SSR Sites',
				description:
					'Introducing a custom vite plugin to index Pagefind in server-side-rendered SvelteKit sites',
				keywords: 'pagefind, ssr, search, static, prerendered',
				translation: 'original',
				readMinutes: 8,
				numWords: 1200,
			},
			vi: {
				slug: '20250610-tim-kiem-trong-ung-dung-sveltekit-ssr-bang-pagefind',
				title: 'Tìm kiếm trong ứng dụng SvelteKit SSR bằng Pagefind',
				description:
					'Index Pagefind cho các trang SvelteKit server-side-rendered thông qua vite plugin',
				keywords: 'pagefind, ssr, tìm kiếm, tĩnh',
				translation: 'manual',
				readMinutes: 8,
				numWords: 1300,
			},
		} as const
	)[lang],
}));
