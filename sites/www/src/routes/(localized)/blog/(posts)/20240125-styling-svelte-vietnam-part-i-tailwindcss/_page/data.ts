import type { PostContent } from '$lib/data/blog';
import type { Post } from '$lib/data/blog';
import { BEHIND_THE_SCREEN, STYLING_SVELTE_VIETNAM } from '$lib/data/blog/series';
import { VNPHANQUANG } from '$lib/data/people';

import En from './content.en.md.svelte?mdsvex';
import Vi from './content.vi.md.svelte?mdsvex';
import thumbnail from './images/thumbnail.jpg?enhanced';
import ogImage from './images/thumbnail.jpg?w=1400&imagetools';

export const post = {
	slug: {
		vi: '20240125-styling-cho-svelte-viet-nam-phan-i-tailwindcss',
		en: '20240125-styling-svelte-vietnam-part-i-tailwindcss',
	},
	date: '2024-01-25T02:15:30.496Z',
	title: {
		en: 'Styling Svelte Vietnam: Part I - TailwindCSS',
		vi: 'Styling cho Svelte Việt Nam: phần I - TailwindCSS',
	},
	description: {
		en: "Let's talk about TailwindCSS, its benefits and the criticism, along with the practicality and flexibility it brings to the sveltevietnam.dev project",
		vi: 'Bàn về TailwindCSS, lợi ích và phê phán, tính thực dụng và sự linh hoạt mang lại cho dự án sveltevietnam.dev',
	},
	githubUrl: {
		en: 'https://github.com/sveltevietnam/sveltevietnam.dev/blob/main/sites/www/src/routes/(localized)/blog/(posts)/20240125-styling-svelte-vietnam-part-i-tailwindcss/_page/content.en.md.svelte',
		vi: 'https://github.com/sveltevietnam/sveltevietnam.dev/blob/main/sites/www/src/routes/(localized)/blog/(posts)/20240125-styling-svelte-vietnam-part-i-tailwindcss/_page/content.vi.md.svelte',
	},
	authors: [VNPHANQUANG],
	originalLang: 'vi',
	keywords: ['blog', 'svelte', 'postcss', 'tailwindcss', 'component', 'styling', 'system'],
	tags: ['inside', 'technical', 'ecosystem'],
	readMinutes: 10,
	ogImage,
	thumbnail,
	wordCount: {
		vi: 2300,
		en: 1000,
	},
	series: [STYLING_SVELTE_VIETNAM, BEHIND_THE_SCREEN],
} satisfies Post;

export const content = {
	en: En,
	vi: Vi,
} satisfies PostContent;
