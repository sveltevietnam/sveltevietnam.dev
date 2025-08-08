import type { Language } from '@sveltevietnam/i18n';
import type { Picture } from 'vite-imagetools';

import type * as t from './types';
export type * from './types';

export function definePerson(def: t.PersonDefinition): t.PersonDefinition {
	return def;
}

const modules = import.meta.glob<t.PersonDefinition>('./*/index.ts', {
	import: 'default',
});
const avatarModules = import.meta.glob<Picture>('./*/avatar.jpg', {
	import: 'default',
	query: '?enhanced&w=400;100',
});
const popImageModules = import.meta.glob<Picture>('./*/pop-image.png', {
	import: 'default',
	query: '?enhanced&w=640;320',
});
const ogImageModules = import.meta.glob<string>('./*/og*.jpg', {
	import: 'default',
	query: '?url',
});
export const ids = Object.keys(modules).map((path) => path.split('/')[1]);

export async function loadPerson(
	id: string,
	lang: Language,
	optionalModules?: Partial<t.PersonOptionalModules> | true,
): Promise<t.Person | null> {
	const path = `./${id}/index.ts`;
	if (!modules[path]) return null;
	const def = await modules[path]();
	const person = def(lang);

	const [avatar, popImage, ogImage] = await Promise.all([
		optionalModules === true || optionalModules?.avatar ? loadPersonAvatar(id) : undefined,
		optionalModules === true || optionalModules?.popImage ? loadPersonPopImage(id) : undefined,
		optionalModules === true || optionalModules?.ogImage ? loadPersonOgImage(id, lang) : undefined,
	]);

	return {
		...person,
		avatar,
		popImage,
		ogImage,
		id,
	};
}

export async function loadAllPeople(
	lang: Language,
	optionalModules?: Partial<t.PersonOptionalModules> | true,
): Promise<t.Person[]> {
	return Promise.all(ids.map((id) => loadPerson(id, lang, optionalModules))).then((people) =>
		people.filter(Boolean),
	);
}

export async function loadPersonOgImage(id: string, lang: Language): Promise<string | undefined> {
	const path = `./${id}/og.${lang}.jpg`;
	if (path in ogImageModules) return ogImageModules[path]();
	const universalPath = `./${id}/og.jpg`;
	if (universalPath in ogImageModules) return ogImageModules[universalPath]();
	return undefined;
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
