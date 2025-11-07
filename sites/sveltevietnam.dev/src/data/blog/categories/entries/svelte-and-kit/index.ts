import { defineBlogCategory } from '..';

export default defineBlogCategory((lang) => ({
	name: 'Svelte & Kit',
	...{
		en: {
			slug: 'svelte-and-kit',
			description:
				'Development-focused articles about techniques, libraries, case studies, ... for Svelte and SvelteKit',
		},
		vi: {
			slug: 'svelte-va-kit',
			description:
				'Bài viết xoay quanh các vấn đề kỹ thuật, thư viện, ví dụ thực tế, ... với Svelte và SvelteKit',
		},
	}[lang],
}));
