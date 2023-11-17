import type { ComponentType, SvelteComponent } from 'svelte';

import { resolveLangText, type LangText, type Language } from '$shared/services/i18n';
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
	title: LangText;
	href: LangText;
	author: LangText;
	description: LangText;
};

export type PostAuthor = {
	name: LangText;
	title?: LangText;
	link?: LangText;
	avatarUrl?: string;
};

export type Post = {
	slug: string;
	date: string;
	title: LangText;
	description: LangText;
	githubUrl: LangText;
	originalLang?: Language;
	tags?: PostTag[];
	authors: PostAuthor[];
	thumbnail?: string;
	ogImage?: string;
	keywords?: LangText[];
	readMinutes?: number;
	wordCount?: LangText;
};

/** resolve any LangText to a string */
export function localizePost(language: Language, post: Post) {
	return {
		...post,
		title: resolveLangText(language, post.title),
		description: resolveLangText(language, post.description),
		keywords: post.keywords?.map((tag) => resolveLangText(language, tag)),
		githubUrl: resolveLangText(language, post.githubUrl),
		authors: post.authors.map((author) => ({
			...author,
			name: resolveLangText(language, author.name),
			title: resolveLangText(language, author.title),
			link: resolveLangText(language, author.link),
		})),
		wordCount: resolveLangText(language, post.wordCount),
	};
}

export function localizeExternalPost(language: Language, post: ExternalPost) {
	return {
		title: resolveLangText(language, post.title),
		href: resolveLangText(language, post.href),
		description: resolveLangText(language, post.description),
		author: resolveLangText(language, post.author),
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
			canonical: `${ROOT_URL}/${language}${BLOG_PATH}/${lPost.slug}`,
		},
	};
}
