---
to: <%= baseDir %>/_page/data.ts
unless_exists: true
---

import type { BlogContent } from '$shared/data/blog';
import type { Post } from '$shared/data/blog';

<% if (languageMap.en) { -%>
import En from './content.en.md.svelte';
<% } -%>
<% if (languageMap.vi) { -%>
import Vi from './content.vi.md.svelte';
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
  originalLang: '<%= post.originalLang %>',
  /** optional metadata fields */
  authors: [
    {
      name: '<%= post.author.name %>',
      /** optional author fields */
    },
  ],
} satisfies Post;

export const content = {
<% if (languageMap.en) { -%>
  en: En,
<% } -%>
<% if (languageMap.vi) { -%>
  vi: Vi,
<% } -%>
} satisfies BlogContent;
