import { defineBlogPostMetadata } from '..';

export default defineBlogPostMetadata((lang) => ({
	publishedAt: new Date('2026-03-21'),
	authors: ['vnphanquang'],
	categories: ['ecosystem'],
	series: ['mini-snippet'],
	outdate: 0,
	...(
		{
			en: {
				slug: '20260321-custom-svelte-treesitter-text-objects-in-neovim',
				title: 'Custom Svelte Treesitter Text Objects in Neovim',
				description:
					'Enable better Svelte code navigation & manipulation by extending Neovim with some custom text objects',
				keywords: 'neovim,editor,tooling,textobjects,treesitter',
				translation: 'original',
				// TODO: update these information once you finish writing
				readMinutes: 4,
				numWords: 500,
			},
			vi: {
				slug: '20260321-tuy-chinh-text-objects-trong-neovim-treesitter-cho-svelte',
				title: 'Tùy chỉnh text objects trong Neovim treesttier cho Svelte',
				description:
					'Mở rộng Neovim để cải thiện khả năng điều hướng và thao tác với mã nguồn Svelte',
				keywords: 'neovim,editor,tooling,textobjects,treesitter',
				translation: 'manual',
				readMinutes: 4,
				numWords: 500,
			},
		} as const
	)[lang],
}));
