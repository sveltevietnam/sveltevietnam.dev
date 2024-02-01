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
		en: '20231220-behind-the-screen-progressive-splashscreen',
		vi: '20231220-behind-the-screen-man-hinh-cho-voi-nang-cao-tang-dan',
	},
	date: '2023-12-20T10:19:08.642Z',
	title: {
		en: 'Progressive Splash Screen',
		vi: 'Màn hình chờ với nâng cao tăng dần',
	},
	description: {
		en: 'Implement an progressively enhanced splash screen for sveltevietnam.dev - an expression of creativity with unexpected benefits',
		vi: 'Thiết lập màn hình chờ cho sveltevietnam.dev, cải thiện trải nghiệm người dùng với nhiều lợi ích bất ngờ',
	},
	githubUrl: {
		en: 'https://github.com/sveltevietnam/sveltevietnam.dev/blob/main/sites/www/src/routes/(localized)/blog/(posts)/20231220-behind-the-screen-progressive-splashscreen/_page/content.en.md.svelte',
		vi: 'https://github.com/sveltevietnam/sveltevietnam.dev/blob/main/sites/www/src/routes/(localized)/blog/(posts)/20231220-behind-the-screen-progressive-splashscreen/_page/content.vi.md.svelte',
	},
	authors: [VNPHANQUANG],
	originalLang: 'vi',
	keywords: [
		'blog',
		'svelte',
		'vietnam',
		'splashscreen',
		'progressive enhancement',
		'animation',
		'user experience',
	],
	tags: ['inside', 'technical'],
	readMinutes: 12,
	ogImage,
	thumbnail,
	wordCount: {
		vi: 2900,
		en: 2300,
	},
	series: [BEHIND_THE_SCREEN],
} satisfies Post;

export const content = {
	en: En,
	vi: Vi,
} satisfies PostContent;
