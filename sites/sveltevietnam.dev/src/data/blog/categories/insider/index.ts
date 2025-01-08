import { defineBlogCategory } from '..';

export const en = defineBlogCategory({
	name: 'Insider',
	slug: 'insider',
	description:
		'An insightful peek behind the curtain into the architecture, design decision, and lesson learned from building the Svelte Vietnam community and the sveltevietnam.dev website',
});

export const vi = defineBlogCategory({
	name: 'Insider',
	slug: 'insider',
	description:
		'Chia sẻ từ quản trị viên về các quyết định kỹ thuật và bài học từ quá trình xây dựng cộng đồng Svelte Việt Nam và trang web sveltevietnam.dev',
});
