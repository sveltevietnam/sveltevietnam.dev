import type { PostContent } from '$shared/data/blog';
import type { Post } from '$shared/data/blog';
import { getPostSeriesBySlug } from '$shared/data/blog/series';
import { people } from '$shared/data/people';

import En from './content.en.md.svelte?mdsvex';
import Vi from './content.vi.md.svelte?mdsvex';
import thumbnail from './images/thumbnail.jpg?enhanced';
import ogImage from './images/thumbnail.jpg?w=1400&imagetools';

export const post = {
	slug: '20231009-behind-the-screen-a-yes-code-blog-of-svelte-vietnam',
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
		en: 'https://github.com/sveltevietnam/sveltevietnam.dev/blob/main/sites/www/src/routes/%5B%5Blang=lang%5D%5D/blog/(posts)/20231009-behind-the-screen-a-yes-code-blog-of-svelte-vietnam/_page/content.en.md.svelte',
		vi: 'https://github.com/sveltevietnam/sveltevietnam.dev/blob/main/sites/www/src/routes/%5B%5Blang=lang%5D%5D/blog/(posts)/20231009-behind-the-screen-a-yes-code-blog-of-svelte-vietnam/_page/content.vi.md.svelte',
	},
	originalLang: 'vi',
	authors: [people.vnphanquang],
	keywords: ['blog', 'svelte', 'vietnam', 'yes-code', 'svelte vietnam'],
	ogImage,
	thumbnail,
	tags: ['inside', 'technical'],
	readMinutes: 11,
	wordCount: {
		vi: 2130,
		en: 1630,
	},
	series: getPostSeriesBySlug('behind-the-screen'),
} satisfies Post;

export const content = {
	en: En,
	vi: Vi,
} satisfies PostContent;
