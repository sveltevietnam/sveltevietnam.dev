import type { Picture } from 'vite-imagetools';

import type * as t from './types';
export type * from './types';

export function definePerson(person: t.MinimalPerson): t.MinimalPerson {
	return person;
}

export function definePersonLinks(links: t.Person['links']): t.Person['links'] {
	return links;
}

const modules = import.meta.glob<t.PersonModule>('./*/index.ts');
const avatarModules = import.meta.glob<Picture>('./*/avatar.jpg', {
	import: 'default',
	query: '?enhanced&w=400;100',
});
const popImageModules = import.meta.glob<Picture>('./*/pop-image.png', {
	import: 'default',
	query: '?enhanced&w=640;320',
});
export const ids = Object.keys(modules).map((path) => path.split('/')[1]);

export async function loadPerson(
	id: string,
	lang: App.Language,
	optionalModules?: Partial<t.PersonOptionalModules> | true,
): Promise<t.Person | null> {
	const path = `./${id}/index.ts`;
	if (!modules[path]) return null;
	const module = await modules[path]();
	let person: t.MinimalPerson;
	if ('en' in module) {
		person = module[lang];
	} else {
		person = module.default;
	}

	const [avatar, popImage] = await Promise.all([
		optionalModules === true || optionalModules?.avatar ? loadPersonAvatar(id) : undefined,
		optionalModules === true || optionalModules?.popImage ? loadPersonPopImage(id) : undefined,
	]);

	return {
		...person,
		links: optionalModules === true || optionalModules?.links ? module.links : undefined,
		avatar,
		popImage,
		id: id,
	};
}

export async function loadPersonAvatar(id: string): Promise<Picture | undefined> {
	const path = `./${id}/avatar.jpg`;
	if (!avatarModules[path]) return undefined;
	return avatarModules[path]();
}

export async function loadPersonPopImage(id: string): Promise<Picture | undefined> {
	const path = `./${id}/pop-image.png`;
	if (!popImageModules[path]) return undefined;
	return popImageModules[path]();
}
