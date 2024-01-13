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
		en: '20231204-behind-the-screen-a-few-secrets-of-sveltevietnam-dev',
		vi: '20231204-behind-the-screen-mot-vai-bi-mat-ve-sveltevietnam-dev',
	},
	date: '2023-12-04T06:03:22.515Z',
	title: {
		en: 'A Few Secrets of sveltevietnam.dev',
		vi: 'Một vài bí mật về sveltevietnam.dev',
	},
	description: {
		en: 'They are not that secret, just quite unnoticeable, but these small details really help enhance the user experience',
		vi: 'Cũng không bí mật gì lắm, chỉ là một vài chi tiết tỉ mỉ ít được nhắc đến, giúp hoàn thiện hơn trải nghiệm người dùng',
	},
	githubUrl: {
		en: 'https://github.com/sveltevietnam/sveltevietnam.dev/blob/main/sites/www/src/routes/(localized)/blog/(posts)/20231204-behind-the-screen-a-few-secrets-of-sveltevietnam-dev/_page/content.en.md.svelte',
		vi: 'https://github.com/sveltevietnam/sveltevietnam.dev/blob/main/sites/www/src/routes/(localized)/blog/(posts)/20231204-behind-the-screen-a-few-secrets-of-sveltevietnam-dev/_page/content.vi.md.svelte',
	},
	authors: [VNPHANQUANG],
	originalLang: 'vi',
	keywords: [
		'blog',
		'svelte',
		'vietnam',
		{
			en: 'progressive enhancement',
			vi: 'cải thiện tăng dần',
		},
		'accessibility',
		{
			en: 'secret',
			vi: 'bí mật',
		},
		{
			en: 'user experience',
			vi: 'trải ngiệm người dùng',
		},
	],
	ogImage,
	thumbnail,
	tags: ['technical', 'inside', 'community'],
	readMinutes: 8,
	wordCount: {
		vi: 2460,
		en: 1890,
	},
	series: [BEHIND_THE_SCREEN],
} satisfies Post;

export const content = {
	en: En,
	vi: Vi,
} satisfies PostContent;
