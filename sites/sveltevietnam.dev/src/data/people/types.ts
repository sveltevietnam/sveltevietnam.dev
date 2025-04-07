import type { Picture } from 'vite-imagetools';

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

export type PersonModule =
	| {
			default: MinimalPerson;
			links?: Person['links'];
	  }
	| {
			en: MinimalPerson;
			vi: MinimalPerson;
			links?: Person['links'];
	  };

export type PersonOptionalModules = {
	links: boolean;
	avatar: boolean;
	popImage: boolean;
};
