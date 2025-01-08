export { default as ids } from './ids';

export type PersonId = (typeof import('./ids').default)[number];

export type Person = {
	id: string;
	name: string;
	description: string;
	link?: string;
};

export function definePerson(person: Omit<Person, 'id'>): Omit<Person, 'id'> {
	return person;
}

type PersonModule =
	| {
			default: Omit<Person, 'id'> ;
	  }
	| {
			en: Omit<Person, 'id'> ;
			vi: Omit<Person, 'id'> ;
	  };

const modules = import.meta.glob<PersonModule>('./*/index.ts');

export async function loadPerson(id: string, lang: App.Language): Promise<Person | null> {
	const path = `./${id}/index.ts`;
	if (!modules[path]) return null;
	const module = await modules[path]();
	let person: Omit<Person, 'id'> ;
	if ('en' in module) {
		person = module[lang];
	} else {
		person = module.default;
	}
	return {
		...person,
		id: id,
	};
}
