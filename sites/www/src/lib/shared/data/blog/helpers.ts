import type { BlogPosting, BreadcrumbList, WithContext } from 'schema-dts';

import { SVELTE_VIETNAM_ORG, SVELTE_VIETNAM_BLOG } from '$shared/data/structured';
import { resolveLangVar, type Language } from '$shared/services/i18n';
import { BLOG_PATH, ROOT_URL } from '$shared/services/navigation';

import type { PostContent, ExternalPost, Post } from './types';

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

export function localizeBlogContent(language: Language, content: PostContent) {
	if ('en' in content && 'vi' in content) {
		return content[language];
	} else if ('en' in content) {
		return content.en;
	} else {
		return content.vi;
	}
}

export function preparePageData(language: Language, post: Post, content: PostContent) {
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
			structured: JSON.stringify([
				{
					'@context': 'https://schema.org',
					'@type': 'BreadcrumbList',
					itemListElement: [
						{
							'@type': 'ListItem',
							position: 1,
							name: 'Blog',
							item: `${ROOT_URL}/${language}${BLOG_PATH}`,
						},
						{
							'@type': 'ListItem',
							position: 2,
							name: lPost.title,
							item: `${ROOT_URL}/${language}${BLOG_PATH}`,
						},
					],
				} as WithContext<BreadcrumbList>,
				{
					'@context': 'https://schema.org',
					'@type': 'BlogPosting',
					'@id': `${canonical}/#BlogPosting`,
					url: canonical,
					mainEntityOfPage: canonical,
					headline: lPost.title,
					name: lPost.title,
					description: lPost.description,
					datePublished: lPost.date,
					dateModified: lPost.date,
					image: ROOT_URL + lPost.ogImage,
					author: lPost.authors.map((author) => ({
						'@type': 'Person',
						name: author.name,
						...(author.link && { url: author.link }),
						...(author.avatarUrl && { image: ROOT_URL + author.avatarUrl }),
					})),
					inLang: language,
					publisher: SVELTE_VIETNAM_ORG,
					isPartOf: SVELTE_VIETNAM_BLOG,
					wordCount: lPost.wordCount,
					keywords: lPost.keywords,
				} as WithContext<BlogPosting>,
			]),
		} satisfies App.PageData['meta'],
	};
}
