import type { PostContent } from '$lib/data/blog';
import type { Post } from '$lib/data/blog';
import { VNPHANQUANG } from '$lib/data/people';

import En from './content.en.md.svelte?mdsvex';
import Vi from './content.vi.md.svelte?mdsvex';
import thumbnail from './images/thumbnail.jpg?enhanced';
import ogImage from './images/thumbnail.jpg?w=1400&imagetools';

export const post = {
	slug: {
		en: '20240414-introduction-to-svelte-action-runtime-superpower',
		vi: '20240414-kham-pha-suc-manh-cua-svelte-action-tai-runtime',
	},
	date: '2024-04-14T00:00:00.000Z',
	title: {
		en: 'Introduction to Svelte Action: Runtime Superpower',
		vi: 'Khám phá sức mạnh của Svelte Action tại runtime',
	},
	description: {
		en: 'A tour of what Svelte action is capable of and how to write your own to enhance applications and handle user interactions at runtime',
		vi: 'Tổng quan về tính ứng dụng và cách triển khai Svelte action để nâng cao tính năng và xử lý tương tác người dùng tại runtime',
	},
	githubUrl: {
		en: 'https://github.com/sveltevietnam/sveltevietnam.dev/blob/main/sites/www/src/routes/(localized)/blog/(posts)/20240414-introduction-to-svelte-action-runtime-superpower/_page/content.en.md.svelte',
		vi: 'https://github.com/sveltevietnam/sveltevietnam.dev/blob/main/sites/www/src/routes/(localized)/blog/(posts)/20240414-introduction-to-svelte-action-runtime-superpower/_page/content.vi.md.svelte',
	},
	authors: [VNPHANQUANG],
	originalLang: 'vi',
	keywords: ['blog', 'svelte', 'vietnam', 'action', 'runtime', 'mount', 'DOM', 'javascript'],
	tags: ['technical', 'svelte'],
	readMinutes: 8,
	ogImage,
	thumbnail,
	wordCount: {
		vi: 1900,
		en: 1600,
	},
} satisfies Post;

export const content = {
	en: En,
	vi: Vi,
} satisfies PostContent;
