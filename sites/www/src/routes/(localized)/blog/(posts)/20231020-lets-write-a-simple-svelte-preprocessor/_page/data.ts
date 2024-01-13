import type { PostContent } from '$lib/data/blog';
import type { Post } from '$lib/data/blog';
import { VNPHANQUANG } from '$lib/data/people';

import En from './content.en.md.svelte?mdsvex';
import Vi from './content.vi.md.svelte?mdsvex';
import ogImage from './images/thumbnail.png';
import thumbnail from './images/thumbnail.png?enhanced';

export const post = {
	slug: {
		en: '20231020-lets-write-a-simple-svelte-preprocessor',
		vi: '20231020-viet-mot-svelte-preprocessor-don-gian',
	},
	date: '2023-10-20T09:48:21.982Z',
	title: {
		en: "Let's Write a Simple Svelte Preprocessor",
		vi: 'Viết một Svelte preprocessor đơn giản',
	},
	description: {
		en: 'Simple use case for Svelte preprocessor as an introduction to those who have not written one before',
		vi: 'Cùng giải quyết một vấn đề đơn giản và cụ thể, thông qua đó giới thiệu cho bạn cách hoạt động của Svelte preprocessor',
	},
	githubUrl: {
		en: 'https://github.com/sveltevietnam/sveltevietnam.dev/blob/main/sites/www/src/routes/(localized)/blog/(posts)/20231020-lets-write-a-simple-svelte-preprocessor/_page/content.en.md.svelte',
		vi: 'https://github.com/sveltevietnam/sveltevietnam.dev/blob/main/sites/www/src/routes/(localized)/blog/(posts)/20231020-lets-write-a-simple-svelte-preprocessor/_page/content.vi.md.svelte',
	},
	originalLang: 'vi',
	authors: [VNPHANQUANG],
	keywords: ['svelte', 'preprocessor', 'plugin'],
	ogImage,
	thumbnail,
	tags: ['technical', 'svelte', 'ecosystem'],
	readMinutes: 12,
	wordCount: {
		vi: 2060,
		en: 1720,
	},
} satisfies Post;

export const content = {
	en: En,
	vi: Vi,
} satisfies PostContent;
