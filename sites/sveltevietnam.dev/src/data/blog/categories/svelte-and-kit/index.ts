import { defineBlogCategory } from '..';

export const en = defineBlogCategory({
	name: 'Svelte & Kit',
	slug: 'svelte-and-kit',
	description:
		'Development-focused articles about techniques, libraries, case studies, ... for Svelte, SvelteKit',
});

export const vi = defineBlogCategory({
	name: 'Svelte & Kit',
	slug: 'svelte-va-kit',
	description:
		'Bài viết xoay quanh các vấn đề kỹ thuật, thư viện, ví dụ thực tế, ... với Svelte và SvelteKit',
});
