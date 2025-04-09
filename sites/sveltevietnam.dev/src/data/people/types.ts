import type { Picture } from 'vite-imagetools';

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
	popImage?: Picture;
	ogImage?: string;
};

export type MinimalPerson = Omit<Person, 'id' | 'avatar' | 'popImage' | 'ogImage'>;
export type PersonDefinition = (lang: App.Language) => MinimalPerson;

export type PersonOptionalModules = {
	avatar: boolean;
	popImage: boolean;
	ogImage: boolean;
};
