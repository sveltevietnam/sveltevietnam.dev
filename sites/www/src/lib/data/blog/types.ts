import type { LangVar } from '@internals/utils/language';
import type { ComponentType, SvelteComponent } from 'svelte';

import type { Person } from '$lib/data/people';

import type { localizeExternalPost, localizePost } from './helpers';

export type PostTag =
	| 'svelte'
	| 'kit'
	| 'ecosystem'
	| 'tooling'
	| 'community'
	| 'inside'
	| 'technical';

export type ExternalPost = {
	title: LangVar<string>;
	href: LangVar<string>;
	author: LangVar<string>;
	description: LangVar<string>;
};

export type LocalizedExternalPost = ReturnType<typeof localizeExternalPost>;

export type PostSeries = {
	slug: string;
	title: LangVar<string>;
};

export type Post = {
	slug: LangVar<string>;
	date: string;
	title: LangVar<string>;
	description: LangVar<string>;
	githubUrl: LangVar<string>;
	originalLang?: App.Language;
	tags?: PostTag[];
	authors: Person[];
	thumbnail?: LangVar<string>;
	ogImage?: LangVar<string>;
	keywords?: LangVar<string>[];
	readMinutes?: number;
	wordCount?: LangVar<number>;
	series?: PostSeries[];
};

export type LocalizedPost = ReturnType<typeof localizePost>;

type LangPostContent = {
	vi: ComponentType<SvelteComponent>;
	en: ComponentType<SvelteComponent>;
};
export type PostContent =
	| LangPostContent
	| Pick<LangPostContent, 'en'>
	| Pick<LangPostContent, 'vi'>;
