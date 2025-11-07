import { defineBlogCategory } from '..';

export default defineBlogCategory((lang) => ({
	...{
		en: {
			name: 'Ecosystem',
			slug: 'ecosystem',
			description:
				'Putting Svelte and SvelteKit into the context of web ecosystem and software development, and discussing how to apply toolings, libraries, design pattern, and infrastructure decisions in projects using Svelte and SvelteKit',
		},
		vi: {
			name: 'Hệ sinh thái',
			slug: 'he-sinh-thai',
			description:
				'Bàn về Svelte và SvelteKit trong ngữ cảnh hệ sinh thái web và phát triển phần mềm, cũng như cách áp dụng các công cụ, thư viện, và thiết kế hạ tầng trong dự án sử dụng Svelte và SvelteKit',
		},
	}[lang],
}));
