import type { PostContent } from '$shared/data/blog';
import type { Post } from '$shared/data/blog';
import { people } from '$shared/data/people';

import En from './content.en.md.svelte?mdsvex';
import Vi from './content.vi.md.svelte?mdsvex';

export const post = {
	slug: '20231204-behind-the-screen-a-few-secrets-of-sveltevietnam-dev',
	date: '2023-12-04T06:03:22.515Z',
	title: {
		en: 'A Few Secrets of sveltevietnam.dev (Behind the Screen)',
		vi: 'Một vài bí mật về sveltevietnam.dev (Behind the Screen)',
	},
	description: {
		en: 'They are not that secret, just quite unnoticeable, but these small details really help enhance the user experience',
		vi: 'Cũng không bí mật gì lắm, chỉ là một vài chi tiết tỉ mỉ ít được biết đến, giúp hoàn thiện hơn trải nghiệm người dùng',
	},
	githubUrl: {
		en: 'https://github.com/sveltevietnam/sveltevietnam.dev/blob/main/sites/www/src/routes/%5B%5Blang=lang%5D%5D/blog/(posts)/20231204-behind-the-screen-a-few-secrets-of-sveltevietnam-dev/_page/content.en.md.svelte',
		vi: 'https://github.com/sveltevietnam/sveltevietnam.dev/blob/main/sites/www/src/routes/%5B%5Blang=lang%5D%5D/blog/(posts)/20231204-behind-the-screen-a-few-secrets-of-sveltevietnam-dev/_page/content.vi.md.svelte',
	},
	authors: [people.vnphanquang],
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
	// ogImage: '',
	// thumbnail: '',
	tags: ['svelte', 'kit', 'technical', 'inside', 'community'],
	readMinutes: 10,
	wordCount: {
		vi: 1000,
		en: 1000,
	},
} satisfies Post;

export const content = {
	en: En,
	vi: Vi,
} satisfies PostContent;
