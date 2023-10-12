import type { PostAuthor } from '$shared/data/blog';

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
    avatarUrl: 'https://avatars.githubusercontent.com/u/25895844?v=4',
  },
} satisfies Record<string, PostAuthor>;
