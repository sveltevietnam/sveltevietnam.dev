import type { ComponentType, SvelteComponent } from 'svelte';

import { resolveLangVar, type LangVar, type Language } from '$shared/services/i18n';
import { BLOG_PATH, ROOT_URL } from '$shared/services/navigation';

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

export type PostAuthor = {
	name: LangVar<string>;
	title?: LangVar<string>;
	link?: LangVar<string>;
	avatarUrl?: string;
};

export type Post = {
	slug: string;
	date: string;
	title: LangVar<string>;
	description: LangVar<string>;
	githubUrl: LangVar<string>;
	originalLang?: Language;
	tags?: PostTag[];
	authors: PostAuthor[];
	thumbnail?: string;
	ogImage?: string;
	keywords?: LangVar<string>[];
	readMinutes?: number;
	wordCount?: LangVar<number>;
};

/** resolve any LangVar to a string */
export function localizePost(language: Language, post: Post) {
	return {
		...post,
		title: resolveLangVar(language, post.title),
		description: resolveLangVar(language, post.description),
		keywords: post.keywords?.map((tag) => resolveLangVar(language, tag) ?? ''),
		githubUrl: resolveLangVar(language, post.githubUrl),
		authors: post.authors.map((author) => ({
			...author,
			name: resolveLangVar(language, author.name),
			title: resolveLangVar(language, author.title),
			link: resolveLangVar(language, author.link),
		})),
		wordCount: resolveLangVar(language, post.wordCount),
	};
}

export function localizeExternalPost(language: Language, post: ExternalPost) {
	return {
		title: resolveLangVar(language, post.title),
		href: resolveLangVar(language, post.href),
		description: resolveLangVar(language, post.description),
		author: resolveLangVar(language, post.author),
	};
}

type LangBlogContent = {
	vi: ComponentType<SvelteComponent>;
	en: ComponentType<SvelteComponent>;
};
export type BlogContent =
	| LangBlogContent
	| Pick<LangBlogContent, 'en'>
	| Pick<LangBlogContent, 'vi'>;

export function localizeBlogContent(language: Language, content: BlogContent) {
	if ('en' in content && 'vi' in content) {
		return content[language];
	} else if ('en' in content) {
		return content.en;
	} else {
		return content.vi;
	}
}

export function preparePageData(language: Language, post: Post, content: BlogContent) {
	const lPost = localizePost(language, post);
	const canonical = `${ROOT_URL}/${language}${BLOG_PATH}/${lPost.slug}`;
	return {
		supportedLanguages: Object.keys(content) as Language[],
		post: lPost,
		meta: {
			title: lPost.title,
			description: lPost.description,
			keywords: lPost.keywords,
			og: {
				type: 'article' as const,
				image: lPost.ogImage,
				imageAlt: lPost.title,
			},
			canonical,
		} satisfies App.PageData['meta'],
	};
}
