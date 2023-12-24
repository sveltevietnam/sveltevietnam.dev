import type { PostContent } from '$shared/data/blog';
import type { Post } from '$shared/data/blog';
import { getPostSeriesBySlug } from '$shared/data/blog/series';
import { people } from '$shared/data/people';

import En from './content.en.md.svelte?mdsvex';
import Vi from './content.vi.md.svelte?mdsvex';
import thumbnail from './images/thumbnail.jpg?enhanced';
import ogImage from './images/thumbnail.jpg?w=1400&imagetools';

export const post = {
	slug: '20231220-behind-the-screen-progressive-splashscreen',
	date: '2023-12-20T10:19:08.642Z',
	title: {
		en: 'Progressive Splash Screen',
		vi: 'Màn hình chờ với nâng cao tăng dần',
	},
	description: {
		en: 'How sveltevietnam.dev implements a splash screen that progressively provides a welcoming user experience while buying time for the rest of the page to load',
		vi: 'Cách sveltevietnam.dev thiếp lập màn hình chờ để chuẩn bị cho những hiệu ứng của trang và cải thiện tăng dần trải nghiệm người dùng',
	},
	githubUrl: {
		en: 'https://github.com/sveltevietnam/sveltevietnam.dev/blob/main/sites/www/src/routes/%5B%5Blang=lang%5D%5D/blog/(posts)/20231220-behind-the-screen-progressive-enhancement/_page/content.en.md.svelte',
		vi: 'https://github.com/sveltevietnam/sveltevietnam.dev/blob/main/sites/www/src/routes/%5B%5Blang=lang%5D%5D/blog/(posts)/20231220-behind-the-screen-progressive-enhancement/_page/content.vi.md.svelte',
	},
	authors: [people.vnphanquang],
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
	series: getPostSeriesBySlug('behind-the-screen'),
} satisfies Post;

export const content = {
	en: En,
	vi: Vi,
} satisfies PostContent;
