import { authors } from '$routes/[[lang=lang]]/blog/_page/authors';
import type { BlogContent } from '$shared/data/blog';
import type { Post } from '$shared/data/blog';

import En from './content.en.md.svelte';
import Vi from './content.vi.md.svelte';
import ogImage from './images/thumbnail.webp';

export const post = {
  slug: '20231012-svelte-vietnam-from-local-to-global',
  date: '2023-10-12T07:38:20.473Z',
  title: {
    en: 'Svelte Vietnam: from Local to Global',
    vi: 'Svelte Việt Nam: từ vườn nhà vươn ra thế giới',
  },
  description: {
    en: "What is Svelte Vietnam? How does it come about? Why is it even necessary? Let's get to the bottom of these questions in this blog post.",
    vi: 'Svelte Việt Nam là gì, khởi đầu từ đâu, vì sao cần phải có? Hãy cùng tìm câu trả lời trong bài viết này.',
  },
  authors: [authors.vnphanquang],
  githubUrl: {
    en: 'https://github.com/sveltevietnam/sveltevietnam.dev/blob/main/sites/www/src/routes/%5B%5Blang=lang%5D%5D/blog/(posts)/20231012-svelte-vietnam-from-local-to-global/_page/content.en.md.svelte',
    vi: 'https://github.com/sveltevietnam/sveltevietnam.dev/blob/main/sites/www/src/routes/%5B%5Blang=lang%5D%5D/blog/(posts)/20231012-svelte-vietnam-from-local-to-global/_page/content.vi.md.svelte',
  },
  originalLang: 'vi',
  keywords: ['blog', 'svelte', 'vietnam', 'community', 'identity'],
  ogImage,
  tags: ['community', 'inside'],
  readMinutes: 10,
} satisfies Post;

export const content = {
  en: En,
  vi: Vi,
} satisfies BlogContent;