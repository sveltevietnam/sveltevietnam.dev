import type { PostAuthor } from '$shared/data/blog';

import vnphanquangAvatarUrl from './images/authors/vnphanquang.png?format=webp';

export const authors = {
  vnphanquang: {
    name: {
      vi: 'Phan Quang',
      en: 'Quang Phan',
    },
    title: {
      en: 'Developer, admin of Svelte Vietnam',
      vi: 'Lập trình viên, quản trị viên Svelte Việt Nam',
    },
    link: 'https://github.com/vnphanquang',
    avatarUrl: vnphanquangAvatarUrl,
  },
} satisfies Record<string, PostAuthor>;
