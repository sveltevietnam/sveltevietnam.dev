import type { PostContent } from '$shared/data/blog';
import type { Post } from '$shared/data/blog';
import { BEHIND_THE_SCREEN } from '$shared/data/blog/series';
import { VNPHANQUANG } from '$shared/data/people';

import En from './content.en.md.svelte?mdsvex';
import Vi from './content.vi.md.svelte?mdsvex';
import thumbnail from './images/thumbnail.jpg?enhanced';
import ogImage from './images/thumbnail.jpg?w=1400&imagetools';

export const post = {
	slug: '20231110-behind-the-screen-dark-mode-with-sveltekit-tailwindcss-and-postcss',
	date: '2023-11-10T06:11:34.187Z',
	title: {
		en: 'Productive Dark Mode with SvelteKit, PostCSS, and TailwindCSS',
		vi: 'Giao diện tối (dark mode) với SvelteKit, PostCSS, và TailwindCSS',
	},
	description: {
		en: 'How sveltevietnam.dev sets up a light-dark mode switch that enables good user experience without trading off developer productivity',
		vi: 'Cách sveltevietnam.dev thiết lập và chuyển đổi giữa giao diện sáng và tối với trải nghiệm thân thiện cho cả người dùng lẫn lập trình viên',
	},
	githubUrl: {
		en: 'https://github.com/sveltevietnam/sveltevietnam.dev/blob/main/sites/www/src/routes/%5B%5Blang=lang%5D%5D/blog/(posts)/20231110-behind-the-screen-dark-mode-with-sveltekit-tailwindcss-and-postcss/_page/content.en.md.svelte',
		vi: 'https://github.com/sveltevietnam/sveltevietnam.dev/blob/main/sites/www/src/routes/%5B%5Blang=lang%5D%5D/blog/(posts)/20231110-behind-the-screen-dark-mode-with-sveltekit-tailwindcss-and-postcss/_page/content.vi.md.svelte',
	},
	authors: [VNPHANQUANG],
	originalLang: 'vi',
	keywords: [
		'svelte',
		'sveltekit',
		'tailwindcss',
		'postcss',
		'dark mode',
		'theme',
		'css',
		'cookie',
		'hook',
		'vanilla',
	],
	ogImage,
	thumbnail,
	tags: ['svelte', 'kit', 'technical', 'inside', 'ecosystem'],
	readMinutes: 18,
	wordCount: {
		vi: 3500,
		en: 2970,
	},
	series: [BEHIND_THE_SCREEN],
} satisfies Post;

export const content = {
	en: En,
	vi: Vi,
} satisfies PostContent;
