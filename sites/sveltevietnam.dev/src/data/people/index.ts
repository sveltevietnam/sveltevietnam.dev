import type { Picture } from 'vite-imagetools';

export { default as ids } from './ids';

export type PersonId = (typeof import('./ids').default)[number];

export type Person = {
	id: string;
	name: string;
	description: string;
	ogImage?: string;
	links?: {
		website?: string;
		bluesky?: string;
		github?: string;
	};
	avatar?: Picture;
	popImage?: Picture;
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
			en: MinimalPerson;
			vi: MinimalPerson;
			links?: Person['links'];
	  };

const modules = import.meta.glob<PersonModule>('./*/index.ts');
const avatarModules = import.meta.glob<Picture>('./*/avatar.jpg', {
	import: 'default',
	query: '?enhanced&w=400;100',
});
const popImageModules = import.meta.glob<Picture>('./*/pop-image.png', {
	import: 'default',
	query: '?enhanced&w=640;320',
});

type PersonOptionalModules = {
	links: boolean;
	avatar: boolean;
	popImage: boolean;
};

export async function loadPerson(
	id: string,
	lang: App.Language,
	optionalModules?: Partial<PersonOptionalModules> | true,
): Promise<Person | null> {
	const path = `./${id}/index.ts`;
	if (!modules[path]) return null;
	const module = await modules[path]();
	let person: MinimalPerson;
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
