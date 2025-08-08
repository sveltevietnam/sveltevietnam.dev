import type { Language } from '@sveltevietnam/i18n';
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
export type PersonDefinition = (lang: Language) => MinimalPerson;

export type PersonOptionalModules = {
	avatar: boolean;
	popImage: boolean;
	ogImage: boolean;
};
