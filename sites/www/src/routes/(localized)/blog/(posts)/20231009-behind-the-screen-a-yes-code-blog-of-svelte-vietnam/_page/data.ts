import type { PostContent } from '$lib/data/blog';
import type { Post } from '$lib/data/blog';
import { BEHIND_THE_SCREEN } from '$lib/data/blog/series';
import { VNPHANQUANG } from '$lib/data/people';

import En from './content.en.md.svelte?mdsvex';
import Vi from './content.vi.md.svelte?mdsvex';
import thumbnail from './images/thumbnail.jpg?enhanced';
import ogImage from './images/thumbnail.jpg?w=1400&imagetools';

export const post = {
	slug: {
		en: '20231009-behind-the-screen-a-yes-code-blog-of-svelte-vietnam',
		vi: '20231009-behind-the-screen-blog-chay-bang-com-va-code',
	},
	date: '2023-10-09T05:14:08.377Z',
	title: {
		en: 'A Yes-Code Blog of Svelte Vietnam',
		vi: 'Blog chạy bằng cơm (và code)',
	},
	description: {
		en: 'Look behind the curtain and discuss the rationale behind the technical design of the Svelte Vietnam Blog',
		vi: 'Sơ lược về những quyết định và thiết kế đằng sau hạ tầng của trang Blog Svelte Việt Nam',
	},
	githubUrl: {
		en: 'https://github.com/sveltevietnam/sveltevietnam.dev/blob/main/sites/www/src/routes/(localized)/blog/(posts)/20231009-behind-the-screen-a-yes-code-blog-of-svelte-vietnam/_page/content.en.md.svelte',
		vi: 'https://github.com/sveltevietnam/sveltevietnam.dev/blob/main/sites/www/src/routes/(localized)/blog/(posts)/20231009-behind-the-screen-a-yes-code-blog-of-svelte-vietnam/_page/content.vi.md.svelte',
	},
	originalLang: 'vi',
	authors: [VNPHANQUANG],
	keywords: ['blog', 'svelte', 'vietnam', 'yes-code', 'svelte vietnam'],
	ogImage,
	thumbnail,
	tags: ['inside', 'technical'],
	readMinutes: 11,
	wordCount: {
		vi: 2130,
		en: 1630,
	},
	series: [BEHIND_THE_SCREEN],
} satisfies Post;

export const content = {
	en: En,
	vi: Vi,
} satisfies PostContent;
