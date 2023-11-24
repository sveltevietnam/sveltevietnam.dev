---
to: <%= baseDir %>/_page/data.ts
unless_exists: true
---

import type { BlogContent } from '$shared/data/blog';
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
  title: '<%= post.title %>',
  description: {
    en: '',
    vi: '',
  },
  githubUrl: {
    en: 'https://github.com/sveltevietnam/sveltevietnam.dev/blob/main/sites/www/src/routes/%5B%5Blang=lang%5D%5D/blog/(posts)/<%= post.slug %>/_page/content.en.md.svelte',
    vi: 'https://github.com/sveltevietnam/sveltevietnam.dev/blob/main/sites/www/src/routes/%5B%5Blang=lang%5D%5D/blog/(posts)/<%= post.slug %>/_page/content.vi.md.svelte',
  },
  authors: [
    {
      name: '<%= post.author.name %>',
      /** optional author fields */
    },
  ],
  /** optional metadata fields */
  # originalLang: '<%= post.originalLang %>',
	# keywords: ['blog', 'svelte', 'vietnam'],
	# ogImage: '',
	# thumbnail: '',
	# tags: [],
	# readMinutes: 10,
	# wordCount: {
	# 	vi: 1000,
	# 	en: 1000,
	# },
} satisfies Post;

export const content = {
<% if (languageMap.en) { -%>
  en: En,
<% } -%>
<% if (languageMap.vi) { -%>
  vi: Vi,
<% } -%>
} satisfies BlogContent;
