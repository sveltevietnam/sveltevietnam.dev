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
		vi: '20240125-styling-cho-svelte-viet-nam-phan-ii-css-components',
		en: '20240125-styling-svelte-vietnam-part-ii-css-components',
	},
	date: '2024-01-25T02:27:32.368Z',
	title: {
		en: 'Styling Svelte Vietnam: Part II - CSS Components',
		vi: 'Styling cho Svelte Việt Nam: phần II - CSS Component',
	},
	description: {
		en: 'Introduce the "CSS component" approach in the age of Javascript, built on dated but invaluable experience from the early decades of the web platform',
		vi: 'Giới thiệu tư duy "CSS component" trong thời đại Javascript, xây dựng trên những kinh nghiệm cũ kĩ nhưng đầy giá trị từ những thập kỉ đầu của nền tảng web',
	},
	githubUrl: {
		en: 'https://github.com/sveltevietnam/sveltevietnam.dev/blob/main/sites/www/src/routes/(localized)/blog/(posts)/20240125-styling-svelte-vietnam-part-ii-css-components/_page/content.en.md.svelte',
		vi: 'https://github.com/sveltevietnam/sveltevietnam.dev/blob/main/sites/www/src/routes/(localized)/blog/(posts)/20240125-styling-svelte-vietnam-part-ii-css-components/_page/content.vi.md.svelte',
	},
	authors: [VNPHANQUANG],
	originalLang: 'vi',
	keywords: ['blog', 'svelte', 'postcss', 'tailwindcss', 'component', 'styling', 'system'],
	tags: ['inside', 'technical', 'ecosystem'],
	readMinutes: 12,
	ogImage,
	thumbnail,
	wordCount: {
		vi: 2400,
		en: 1900,
	},
	series: [STYLING_SVELTE_VIETNAM, BEHIND_THE_SCREEN],
} satisfies Post;

export const content = {
	en: En,
	vi: Vi,
} satisfies PostContent;
