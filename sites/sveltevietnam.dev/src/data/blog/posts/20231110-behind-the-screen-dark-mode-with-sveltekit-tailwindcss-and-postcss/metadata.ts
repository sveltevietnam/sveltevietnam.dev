import { defineBlogPostMetadata } from '..';

export const en = defineBlogPostMetadata({
	slug: '20231110-behind-the-screen-dark-mode-with-sveltekit-tailwindcss-and-postcss',
	title: 'Productive Dark Mode with SvelteKit, PostCSS, and TailwindCSS',
	description: 'How sveltevietnam.dev sets up a light-dark mode switch that enables good user experience without trading off developer productivity',
	publishedAt: new Date('2023-11-10'),
	authors: ['vnphanquang'],
	categories: ['insider', 'svelte-and-kit', 'ecosystem'],
	keywords: 'postcss, color scheme, cookie, vanilla, dark mode',
	readMinutes: 18,
	numWords: 2970,
	translation: 'manual',
	series: ['behind-the-screen'],
});

export const vi = defineBlogPostMetadata({
	slug: '20231110-behind-the-screen-giao-dien-toi-voi-sveltekit-postcss-va-tailwindcss',
	title: 'Giao diện tối (dark mode) với SvelteKit, PostCSS, và TailwindCSS',
	description: 'Cách sveltevietnam.dev thiết lập và chuyển đổi giữa giao diện sáng và tối với trải nghiệm thân thiện cho cả người dùng lẫn lập trình viên',
	publishedAt: new Date('2023-11-10'),
	authors: ['vnphanquang'],
	categories: ['insider', 'svelte-and-kit', 'ecosystem'],
	keywords: 'postcss, color scheme, cookie, vanilla, dark mode',
	readMinutes: 18,
	numWords: 3500,
	translation: 'original',
	series: ['behind-the-screen'],
});
