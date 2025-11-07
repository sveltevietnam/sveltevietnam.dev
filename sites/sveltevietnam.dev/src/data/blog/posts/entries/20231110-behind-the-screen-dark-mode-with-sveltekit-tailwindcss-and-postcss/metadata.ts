import { defineBlogPostMetadata } from '..';

export default defineBlogPostMetadata((lang) => ({
	keywords: 'postcss, color scheme, cookie, vanilla, dark mode',
	publishedAt: new Date('2023-11-10'),
	authors: ['vnphanquang'],
	categories: ['insider', 'svelte-and-kit', 'ecosystem'],
	series: ['behind-the-screen'],
	outdate: 365, // 1 year in days
	...(
		{
			en: {
				slug: '20231110-behind-the-screen-dark-mode-with-sveltekit-tailwindcss-and-postcss',
				title: 'Productive Dark Mode with SvelteKit, PostCSS, and TailwindCSS',
				description:
					'How sveltevietnam.dev sets up a light-dark mode switch that enables good user experience without trading off developer productivity',
				readMinutes: 18,
				numWords: 2970,
				translation: 'manual',
			},
			vi: {
				slug: '20231110-behind-the-screen-giao-dien-toi-voi-sveltekit-postcss-va-tailwindcss',
				title: 'Giao diện tối (dark mode) với SvelteKit, PostCSS, và TailwindCSS',
				description:
					'Cách sveltevietnam.dev thiết lập và chuyển đổi giữa giao diện sáng và tối với trải nghiệm thân thiện cho cả người dùng lẫn lập trình viên',
				readMinutes: 18,
				numWords: 3500,
				translation: 'original',
			},
		} as const
	)[lang],
}));
