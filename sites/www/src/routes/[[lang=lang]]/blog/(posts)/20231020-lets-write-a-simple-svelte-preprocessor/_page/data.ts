import { authors } from '$routes/[[lang=lang]]/blog/_page/authors';
import type { BlogContent } from '$shared/data/blog';
import type { Post } from '$shared/data/blog';

import En from './content.en.md.svelte';
import Vi from './content.vi.md.svelte';
import ogImage from './images/thumbnail.webp';

export const post = {
  slug: '20231020-lets-write-a-simple-svelte-preprocessor',
  date: '2023-10-20T09:48:21.982Z',
  title: {
    en: "Let's Write a Simple Svelte Preprocessor",
    vi: 'Viết một Svelte preprocessor đơn giản',
  },
  description: {
    en: 'Simple use case for Svelte preprocessor as an introduction to those who have not written one before',
    vi: 'Cùng giải quyết một vấn đề đơn giản và cụ thể, thông qua đó giới thiệu cho bạn cách hoạt động của Svelte preprocessor',
  },
  githubUrl: {
    en: 'https://github.com/sveltevietnam/sveltevietnam.dev/blob/main/sites/www/src/routes/%5B%5Blang=lang%5D%5D/blog/(posts)/20231020-lets-write-a-simple-svelte-preprocessor/_page/content.en.md.svelte',
    vi: 'https://github.com/sveltevietnam/sveltevietnam.dev/blob/main/sites/www/src/routes/%5B%5Blang=lang%5D%5D/blog/(posts)/20231020-lets-write-a-simple-svelte-preprocessor/_page/content.vi.md.svelte',
  },
  originalLang: 'vi',
  authors: [authors.vnphanquang],
  keywords: ['svelte', 'preprocessor', 'plugin'],
  ogImage,
  tags: ['technical', 'svelte', 'ecosystem'],
  readMinutes: 12,
} satisfies Post;

export const content = {
  en: En,
  vi: Vi,
} satisfies BlogContent;
