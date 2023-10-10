import type { BlogContent } from '$shared/data/blog';
import type { Post } from '$shared/data/blog';

import En from './content.en.md.svelte';
import Vi from './content.vi.md.svelte';
import ogImage from './images/thumbnail.webp';

export const post = {
  slug: '20231009-behind-the-screen-a-yes-code-blog-of-svelte-vietnam',
  date: '2023-10-09T05:14:08.377Z',
  title: {
    en: 'Behind the Screen: A Yes-Code Blog of Svelte Vietnam',
    vi: 'Behind the Screen: blog chạy bằng cơm (và code)',
  },
  description: {
    en: 'Look behind the curtain and discuss the rationale behind the technical design of the Svelte Vietnam Blog',
    vi: 'Sơ lược về những quyết định và thiết kế đằng sau hạ tầng của trang Blog Svelte Việt Nam',
  },
  githubUrl: {
    en: 'https://github.com/sveltevietnam/sveltevietnam.dev/blob/main/sites/www/src/routes/%5B%5Blang=lang%5D%5D/blog/(posts)/20231009-behind-the-screen-a-yes-code-blog-of-svelte-vietnam/_page/content.en.md.svelte',
    vi: 'https://github.com/sveltevietnam/sveltevietnam.dev/blob/main/sites/www/src/routes/%5B%5Blang=lang%5D%5D/blog/(posts)/20231009-behind-the-screen-a-yes-code-blog-of-svelte-vietnam/_page/content.vi.md.svelte',
  },
  authors: [
    {
      name: {
        vi: 'Phan Quang',
        en: 'Quang Phan',
      },
      title: {
        en: 'Admin of Svelte Vietnam',
        vi: 'Quản trị viên Svelte Việt Nam',
      },
      link: 'https://github.com/vnphanquang',
      avatarUrl: 'https://avatars.githubusercontent.com/u/25895844?v=4',
    },
  ],
  keywords: ['blog', 'svelte', 'vietnam', 'yes-code', 'svelte vietnam'],
  ogImage,
  tags: ['inside', 'technical'],
  readMinutes: 11,
} satisfies Post;

export const content = {
  en: En,
  vi: Vi,
} satisfies BlogContent;
