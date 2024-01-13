---
to: <%= baseDir %>/_page/data.ts
unless_exists: true
---

import type { PostContent } from '$lib/data/blog';
import type { Post } from '$lib/data/blog';

<% if (languageMap.en) { -%>
import En from './content.en.md.svelte?mdsvex';
<% } -%>
<% if (languageMap.vi) { -%>
import Vi from './content.vi.md.svelte?mdsvex';
<% } -%>
// import thumbnail from './images/thumbnail.jpg?enhanced';
// import ogImage from './images/thumbnail.jpg?w=1400&imagetools';

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
		en: 'https://github.com/sveltevietnam/sveltevietnam.dev/blob/main/sites/www/src/routes/(localized)/blog/(posts)/<%= post.slug %>/_page/content.en.md.svelte',
		vi: 'https://github.com/sveltevietnam/sveltevietnam.dev/blob/main/sites/www/src/routes/(localized)/blog/(posts)/<%= post.slug %>/_page/content.vi.md.svelte',
	},
<% } else { -%>
	title: '<%= post.title %>',
	description: '',
<% if (languageMap.en) { -%>
	githubUrl: 'https://github.com/sveltevietnam/sveltevietnam.dev/blob/main/sites/www/src/routes/(localized)/blog/(posts)/<%= post.slug %>/_page/content.en.md.svelte',
	<% } -%>
<% if (languageMap.vi) { -%>
	githubUrl: 'https://github.com/sveltevietnam/sveltevietnam.dev/blob/main/sites/www/src/routes/(localized)/blog/(posts)/<%= post.slug %>/_page/content.vi.md.svelte',
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
	// ogImage,
	// thumbnail,
<% if (languageMap.en && languageMap.vi) { -%>
	// wordCount: {
	// 	vi: 1000,
	// 	en: 1000,
	// },
<% } else { -%>
	// wordCount: 1000,
<% } -%>
	// series: [],
} satisfies Post;

export const content = {
<% if (languageMap.en) { -%>
	en: En,
<% } -%>
<% if (languageMap.vi) { -%>
	vi: Vi,
<% } -%>
} satisfies PostContent;
