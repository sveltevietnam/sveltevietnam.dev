import { defineBlogSeries } from '..';

export default defineBlogSeries((lang) => ({
	...{
		en: {
			slug: 'people-of-svelte',
			name: 'People of Svelte',
			description:
				'“People of Svelte - a mosaic of diverse voices” — growing our community together, one story at a time',
		},
		vi: {
			slug: 'cong-dong-svelte',
			name: 'Cộng đồng Svelte',
			description:
				'“Cộng đồng Svelte - một bức tranh đa sắc” — tô màu cộng đồng qua từng mẫu chuyện',
		},
	}[lang],
}));
