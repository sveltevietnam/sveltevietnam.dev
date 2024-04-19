import type { PostContent } from '$lib/data/blog';
import type { Post } from '$lib/data/blog';
import { VNPHANQUANG } from '$lib/data/people';

import En from './content.en.md.svelte?mdsvex';
import Vi from './content.vi.md.svelte?mdsvex';
import thumbnail from './images/thumbnail.jpg?enhanced';
import ogImage from './images/thumbnail.jpg?w=1400&imagetools';

export const post = {
	slug: {
		en: '20240420-come-for-svelte-stay-for-the-web',
		vi: '20240420-den-voi-web-thong-qua-svelte',
	},
	date: '2024-04-20T00:00:00.000Z',
	title: {
		en: 'Come for Svelte, Stay for the Web',
		vi: 'Đến với web thông qua Svelte',
	},
	description: {
		en: 'Svelte is exceptionally good at staying out of your way, allowing you to focus on building a better web. No one cares about frameworks anyway!',
		vi: 'API của Svelte được thiết kế để thân thiện với các công nghệ và kiến thức nền tảng, giúp bạn dễ dàng tập trung vào việc xây dựng ứng dụng web, thay vì quan tâm đến framework này và nọ.',
	},
	githubUrl: {
		en: 'https://github.com/sveltevietnam/sveltevietnam.dev/blob/main/sites/www/src/routes/(localized)/blog/(posts)/20240420-come-for-svelte-stay-for-the-web/_page/content.en.md.svelte',
		vi: 'https://github.com/sveltevietnam/sveltevietnam.dev/blob/main/sites/www/src/routes/(localized)/blog/(posts)/20240420-come-for-svelte-stay-for-the-web/_page/content.vi.md.svelte',
	},
	authors: [VNPHANQUANG],
	originalLang: 'vi',
	keywords: ['blog', 'svelte', 'vietnam', 'why', 'action', 'community', 'ecosystem'],
	tags: ['svelte', 'community', 'ecosystem', 'technical'],
	readMinutes: 8,
	ogImage,
	thumbnail,
	wordCount: {
		vi: 1990,
		en: 1590,
	},
} satisfies Post;

export const content = {
	en: En,
	vi: Vi,
} satisfies PostContent;
