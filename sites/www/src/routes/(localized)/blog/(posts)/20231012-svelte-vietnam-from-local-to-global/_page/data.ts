import type { PostContent } from '$lib/data/blog';
import type { Post } from '$lib/data/blog';
import { VNPHANQUANG } from '$lib/data/people';

import En from './content.en.md.svelte?mdsvex';
import Vi from './content.vi.md.svelte?mdsvex';
import ogImage from './images/thumbnail.png';
import thumbnail from './images/thumbnail.png?enhanced';

export const post = {
	slug: {
		en: '20231012-svelte-vietnam-from-local-to-global',
		vi: '20231012-svelte-viet-nam-tu-vuon-nha-vuon-ra-the-gioi',
	},
	date: '2023-10-12T07:38:20.473Z',
	title: {
		en: 'Svelte Vietnam: from Local to Global',
		vi: 'Svelte Việt Nam: từ vườn nhà vươn ra thế giới',
	},
	description: {
		en: "What is Svelte Vietnam? How does it come about? Why is it even necessary? Let's get to the bottom of these questions in this blog post.",
		vi: 'Svelte Việt Nam là gì, khởi đầu từ đâu, vì sao cần phải có? Hãy cùng tìm câu trả lời trong bài viết này.',
	},
	authors: [VNPHANQUANG],
	githubUrl: {
		en: 'https://github.com/sveltevietnam/sveltevietnam.dev/blob/main/sites/www/src/routes/(localized)/blog/(posts)/20231012-svelte-vietnam-from-local-to-global/_page/content.en.md.svelte',
		vi: 'https://github.com/sveltevietnam/sveltevietnam.dev/blob/main/sites/www/src/routes/(localized)/blog/(posts)/20231012-svelte-vietnam-from-local-to-global/_page/content.vi.md.svelte',
	},
	originalLang: 'vi',
	keywords: ['blog', 'svelte', 'vietnam', 'community', 'identity'],
	ogImage,
	thumbnail,
	tags: ['community', 'inside'],
	readMinutes: 10,
	wordCount: {
		vi: 1950,
		en: 1540,
	},
} satisfies Post;

export const content = {
	en: En,
	vi: Vi,
} satisfies PostContent;
