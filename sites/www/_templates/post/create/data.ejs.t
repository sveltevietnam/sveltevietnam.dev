---
to: <%= baseDir %>/_page/data.ts
unless_exists: true
---

import type { BlogContent } from '$shared/data/blog';
import type { Post } from '$shared/data/blog';

<% if (languages.en) { -%>
import En from './content.en.md.svelte';
<% } -%>
<% if (languages.vi) { -%>
import Vi from './content.vi.md.svelte';
<% } -%>

export const post = {
  slug: '<%= post.slug %>',
  date: '<%= post.date %>',
  title: '<%= post.title %>',
  description: '',
  /** optional metadata fields */
  authors: [
    {
      name: '<%= post.author.name %>',
      /** optional author fields */
    },
  ],
} satisfies Post;

export const content = {
<% if (languages.en) { -%>
  en: En,
<% } -%>
<% if (languages.vi) { -%>
  vi: Vi,
<% } -%>
} satisfies BlogContent;
