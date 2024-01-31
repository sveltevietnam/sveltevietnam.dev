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
		en: '20240125-styling-svelte-vietnam-part-iii-code-discovery-portability',
		vi: '20240125-styling-cho-svelte-viet-nam-phan-iii-kham-pha-va-tai-su-dung-ma-nguon',
	},
	date: '2024-01-25T02:33:28.468Z',
	title: {
		en: 'Styling Svelte Vietnam: Part III - Code Discovery & Portability',
		vi: 'Styling cho Svelte Việt Nam: phần III - khám phá và tái sử dụng mã nguồn',
	},
	description: {
		en: 'Putting together a "CSS Component" approach into Tailwind and the PostCSS ecosystem for building minimal and flexible design systems',
		vi: 'Kết hợp Tailwind và hệ sinh thái PostCSS với ý tưởng CSS Component để xây dựng hệ thống thiết kế tối giản và linh hoạt',
	},
	githubUrl: {
		en: 'https://github.com/sveltevietnam/sveltevietnam.dev/blob/main/sites/www/src/routes/(localized)/blog/(posts)/20240125-styling-svelte-vietnam-part-iii-code-discovery-portability/_page/content.en.md.svelte',
		vi: 'https://github.com/sveltevietnam/sveltevietnam.dev/blob/main/sites/www/src/routes/(localized)/blog/(posts)/20240125-styling-svelte-vietnam-part-iii-code-discovery-portability/_page/content.vi.md.svelte',
	},
	authors: [VNPHANQUANG],
	originalLang: 'vi',
	keywords: ['blog', 'svelte', 'postcss', 'tailwindcss', 'component', 'styling', 'system'],
	tags: ['inside', 'technical', 'ecosystem'],
	readMinutes: 9,
	ogImage,
	thumbnail,
	wordCount: {
		vi: 2300,
		en: 1800,
	},
	series: [STYLING_SVELTE_VIETNAM, BEHIND_THE_SCREEN],
} satisfies Post;

export const content = {
	en: En,
	vi: Vi,
} satisfies PostContent;
