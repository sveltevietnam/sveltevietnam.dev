import type { LangVar } from '@internals/utils/language';

export type Sponsor = {
	id: string;
	/** inline svg with height of 40 */
	image: string;
	name: LangVar<string>;
	href?: string;
};

/* ------↓ WIREFRAME ↓------- */

export type Job = {
	id: string;
	title: string;
	href: string;
	image?: string;
	company: string;
	salary?: string;
	location?: string;
	locationPolicy?: 'remote' | 'hybrid';
	createdAt: string;
	expiresAt?: string;
	sponsor?: Sponsor;
};

export type ProfileLinks = {
	twitter?: string;
	github?: string;
	linkedin?: string;
	website?: string;
};

export type Contributor = {
	fullName: string;
	contribution: string;
	affiliation?: string;
	links?: ProfileLinks;
};

export type Project = {
	id: string;
	name: string;
	image?: string;
	description: string;
	by?: string;
	href?: string;
};
