import type { LangVar } from '$shared/services/i18n';

import vnphanquangAvatarUrl from './images/authors/vnphanquang.png?format=webp';

export type Person = {
	name: LangVar<string>;
	title?: LangVar<string>;
	link?: LangVar<string>;
	avatarUrl?: string;
};

export const people = {
	vnphanquang: {
		name: {
			vi: 'Phan Quang',
			en: 'Quang Phan',
		},
		title: {
			en: 'Developer, admin of Svelte Vietnam',
			vi: 'Lập trình viên, quản trị viên Svelte Việt Nam',
		},
		link: 'https://vnphanquang.com',
		avatarUrl: vnphanquangAvatarUrl,
	},
} satisfies Record<string, Person>;
