import { localizeLangVar, type LangVar } from '@internals/utils/language';

import trongnguyen24Avatar from './avatars/trongnguyen24.jpg?format=webp&imagetools';
import vnphanquangAvatar from './avatars/vnphanquang.png?format=webp&imagetools';

export type Person = {
	name: LangVar<string>;
	title?: LangVar<string>;
	link?: LangVar<string>;
	avatarStaticPath?: string;
};

export type LocalizedPerson = ReturnType<typeof localizePerson>;

export const VNPHANQUANG = {
	name: {
		vi: 'Phan Quang',
		en: 'Quang Phan',
	},
	title: {
		en: 'Developer, admin of Svelte Vietnam',
		vi: 'Lập trình viên, quản trị viên Svelte Việt Nam',
	},
	link: 'https://vnphanquang.com',
	avatarStaticPath: vnphanquangAvatar,
} satisfies Person;

export const TRONGNGUYEN24 = {
	name: {
		vi: 'Lê Nguyên',
		en: 'Nguyen Le',
	},
	title: {
		en: 'UI/UX designer',
		vi: 'Thiết kế viên UI/UX',
	},
	link: 'https://nguyenle.pages.dev',
	avatarStaticPath: trongnguyen24Avatar,
} satisfies Person;

export const PEOPLE = [VNPHANQUANG, TRONGNGUYEN24] satisfies Person[];

export function localizePerson(language: App.Language, person: Person) {
	return {
		...person,
		name: localizeLangVar(language, person.name),
		title: localizeLangVar(language, person.title),
		link: localizeLangVar(language, person.link),
	};
}
