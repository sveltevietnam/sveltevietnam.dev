import { defineBlogCategory } from '..';

export default defineBlogCategory((lang) => ({
	name: 'Insider',
	slug: 'insider',
	...{
		en: {
			description:
				'An insightful peek behind the curtain into the architecture, design decision, and lesson learned from building the Svelte Vietnam community and the sveltevietnam.dev website',
		},
		vi: {
			description:
				'Chia sẻ từ quản trị viên về các quyết định kỹ thuật và bài học từ quá trình xây dựng cộng đồng Svelte Việt Nam và trang web sveltevietnam.dev',
		},
	}[lang],
}));
