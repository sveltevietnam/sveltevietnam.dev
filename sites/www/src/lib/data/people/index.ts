import { localizeLangVar, type LangVar, type Language } from '$lib/i18n';

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

export const PEOPLE = [VNPHANQUANG] satisfies Person[];

export function localizePerson(language: Language, person: Person) {
	return {
		...person,
		name: localizeLangVar(language, person.name),
		title: localizeLangVar(language, person.title),
		link: localizeLangVar(language, person.link),
	};
}
