import { defineBlogSeries } from '..';

export default defineBlogSeries((lang) => ({
	slug: 'styling-svelte-vietnam',
	...{
		en: {
			name: 'Styling Svelte Vietnam',
			description:
				'A three-parted sub-series of "Behind the Screen" focusing on discussions about the design and usage of CSS system for sveltevietnam.dev',
		},
		vi: {
			name: 'Styling cho Svelte Việt Nam',
			description:
				'Tập hợp ba bài viết trong chuỗi "Behind the Screen" với tập trung vào cách thiết kế hệ thống CSS cho trang web sveltevietnam.dev',
		},
	}[lang],
}));
