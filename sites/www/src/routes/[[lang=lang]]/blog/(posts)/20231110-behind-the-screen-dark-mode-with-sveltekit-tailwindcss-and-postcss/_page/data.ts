import { authors } from '$routes/[[lang=lang]]/blog/_page/authors';
import type { BlogContent } from '$shared/data/blog';
import type { Post } from '$shared/data/blog';

import En from './content.en.md.svelte';
import Vi from './content.vi.md.svelte';
import ogImage from './images/thumbnail.png';
import thumbnail from './images/thumbnail.png?enhanced';

export const post = {
	slug: '20231110-behind-the-screen-dark-mode-with-sveltekit-tailwindcss-and-postcss',
	date: '2023-11-10T06:11:34.187Z',
	title: {
		en: 'Productive Dark Mode with SvelteKit, PostCSS, and TailwindCSS (Behind the Screen)',
		vi: 'Giao diện tối (dark mode) với SvelteKit, PostCSS, và TailwindCSS (Behind the Screen)',
	},
	description: {
		en: 'How sveltevietnam.dev sets up a light-dark mode switch that enables good user experience without trading off developer productivity',
		vi: 'Cách sveltevietnam.dev thiết lập và chuyển đổi giữa giao diện sáng và tối với trải nghiệm thân thiện cho cả người dùng lẫn lập trình viên',
	},
	githubUrl: {
		en: 'https://github.com/sveltevietnam/sveltevietnam.dev/blob/main/sites/www/src/routes/%5B%5Blang=lang%5D%5D/blog/(posts)/20231110-behind-the-screen-dark-mode-with-sveltekit-tailwindcss-and-postcss/_page/content.en.md.svelte',
		vi: 'https://github.com/sveltevietnam/sveltevietnam.dev/blob/main/sites/www/src/routes/%5B%5Blang=lang%5D%5D/blog/(posts)/20231110-behind-the-screen-dark-mode-with-sveltekit-tailwindcss-and-postcss/_page/content.vi.md.svelte',
	},
	authors: [authors.vnphanquang],
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
		vi: '~3500',
		en: '~2970',
	},
} satisfies Post;

export const content = {
	en: En,
	vi: Vi,
} satisfies BlogContent;
