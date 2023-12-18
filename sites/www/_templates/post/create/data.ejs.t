---
to: <%= baseDir %>/_page/data.ts
unless_exists: true
---

import type { PostContent } from '$shared/data/blog';
import type { Post } from '$shared/data/blog';

<% if (languageMap.en) { -%>
import En from './content.en.md.svelte?mdsvex';
<% } -%>
<% if (languageMap.vi) { -%>
import Vi from './content.vi.md.svelte?mdsvex';
<% } -%>

export const post = {
	slug: '<%= post.slug %>',
	date: '<%= post.date %>',
<% if (languageMap.en && languageMap.vi) { -%>
	title: {
		en: '<%= post.title %>',
		vi: '<%= post.title %>',
	},
	description: {
		en: '',
		vi: '',
	},
	githubUrl: {
		en: 'https://github.com/sveltevietnam/sveltevietnam.dev/blob/main/sites/www/src/routes/%5B%5Blang=lang%5D%5D/blog/(posts)/<%= post.slug %>/_page/content.en.md.svelte',
		vi: 'https://github.com/sveltevietnam/sveltevietnam.dev/blob/main/sites/www/src/routes/%5B%5Blang=lang%5D%5D/blog/(posts)/<%= post.slug %>/_page/content.vi.md.svelte',
	},
<% } else { -%>
	title: '<%= post.title %>',
	description: '',
<% if (languageMap.en) { -%>
	githubUrl: 'https://github.com/sveltevietnam/sveltevietnam.dev/blob/main/sites/www/src/routes/%5B%5Blang=lang%5D%5D/blog/(posts)/<%= post.slug %>/_page/content.en.md.svelte',
	<% } -%>
<% if (languageMap.vi) { -%>
	githubUrl: 'https://github.com/sveltevietnam/sveltevietnam.dev/blob/main/sites/www/src/routes/%5B%5Blang=lang%5D%5D/blog/(posts)/<%= post.slug %>/_page/content.vi.md.svelte',
<% } -%>
<% } -%>
	authors: [
		{
			name: '<%= post.author.name %>',
			/** optional author fields */
		},
	],
	/** optional metadata fields */
	// originalLang: '<%= post.originalLang %>',
	// keywords: ['blog', 'svelte', 'vietnam'],
	// tags: [],
	// readMinutes: 10,
<% if (languageMap.en && languageMap.vi) { -%>
	// ogImage: {
	//	vi: '',
	//	en: '',
	// },
	// thumbnail: {
	//	vi: '',
	//	en: '',
	// },
	// wordCount: {
	// 	vi: 1000,
	// 	en: 1000,
	// },
<% } else { -%>
	// ogImage: '',
	// thumbnail: '',
	// wordCount: 1000,
<% } -%>
} satisfies Post;

export const content = {
<% if (languageMap.en) { -%>
	en: En,
<% } -%>
<% if (languageMap.vi) { -%>
	vi: Vi,
<% } -%>
} satisfies PostContent;
