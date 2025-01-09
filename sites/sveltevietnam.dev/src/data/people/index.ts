import type { Picture } from 'vite-imagetools';

export { default as ids } from './ids';

export type PersonId = (typeof import('./ids').default)[number];

export type Person = {
	id: string;
	name: string;
	description: string;
	links?: {
		website?: string;
		bluesky?: string;
		github?: string;
	};
	avatar?: Picture;
};

export type MinimalPerson = Omit<Person, 'links' | 'id' | 'avatar'>;

export function definePerson(person: MinimalPerson): MinimalPerson {
	return person;
}

export function definePersonLinks(links: Person['links']): Person['links'] {
	return links;
}

type PersonModule =
	| {
			default: MinimalPerson;
			links?: Person['links'];
	  }
	| {
			en: MinimalPerson ;
			vi: MinimalPerson ;
			links?: Person['links'];
	  };

const modules = import.meta.glob<PersonModule>('./*/index.ts');
const avatarModules = import.meta.glob<Picture>('./*/avatar.jpg', {
	import: 'default',
	query: '?enhanced&w=320;200;96',
});

type PersonOptionalModules = {
	links: boolean;
	avatar: boolean;
}

export async function loadPerson(id: string, lang: App.Language, optionalModules?: PersonOptionalModules | true): Promise<Person | null> {
	const path = `./${id}/index.ts`;
	if (!modules[path]) return null;
	const module = await modules[path]();
	let person: MinimalPerson;
	if ('en' in module) {
		person = module[lang];
	} else {
		person = module.default;
	}
	return {
		...person,
		links: (optionalModules === true || optionalModules?.links ) ? module.links : undefined,
		avatar: (optionalModules === true || optionalModules?.avatar) ? await loadPersonAvatar(id) : undefined,
		id: id,
	};
}

export async function loadPersonAvatar(id: string): Promise<Picture | undefined> {
	const path = `./${id}/avatar.jpg`;
	if (!avatarModules[path]) return undefined;
	return avatarModules[path]();
}
