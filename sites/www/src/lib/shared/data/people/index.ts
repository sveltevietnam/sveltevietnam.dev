import { resolveLangVar, type LangVar, type Language } from '$shared/services/i18n';

import vnphanquangAvatarUrl from './avatars/vnphanquang.png?format=webp&imagetools';

export type Person = {
	name: LangVar<string>;
	title?: LangVar<string>;
	link?: LangVar<string>;
	avatarUrl?: string;
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
	avatarUrl: vnphanquangAvatarUrl,
} satisfies Person;

export const PEOPLE = [VNPHANQUANG] satisfies Person[];

export function localizePerson(language: Language, person: Person) {
	return {
		...person,
		name: resolveLangVar(language, person.name),
		title: resolveLangVar(language, person.title),
		link: resolveLangVar(language, person.link),
	};
}
