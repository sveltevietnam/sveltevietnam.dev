import { delocalizeUrl } from '@internals/utils';
import type { BlogPosting, BreadcrumbList, WithContext } from 'schema-dts';

import { ROUTE_MAP } from '$client/contexts/navigation';
import { localizePerson } from '$lib/data/people';
import { SVELTE_VIETNAM_ORG, SVELTE_VIETNAM_BLOG, structurePerson } from '$lib/data/structured';
import { LANGUAGES, delocalizeLangVar, localizeLangVar, type Language } from '$lib/i18n';

import type { PostContent, ExternalPost, Post, PostSeries } from './types';

/** resolve any LangVar to a string */
export function localizePost(language: Language, post: Post) {
	return {
		...post,
		slug: localizeLangVar(language, post.slug),
		title: localizeLangVar(language, post.title),
		description: localizeLangVar(language, post.description),
		keywords: post.keywords?.map((tag) => localizeLangVar(language, tag)),
		githubUrl: localizeLangVar(language, post.githubUrl),
		authors: post.authors.map((author) => localizePerson(language, author)),
		wordCount: localizeLangVar(language, post.wordCount),
		ogImage: localizeLangVar(language, post.ogImage),
		thumbnail: localizeLangVar(language, post.thumbnail),
		series: !post.series ? undefined : post.series.map((s) => localizePostSeries(language, s)),
	};
}

export function localizePostSeries(language: Language, series: PostSeries) {
	return {
		...series,
		title: localizeLangVar(language, series.title),
	};
}

export function localizeExternalPost(language: Language, post: ExternalPost) {
	return {
		title: localizeLangVar(language, post.title),
		href: localizeLangVar(language, post.href),
		description: localizeLangVar(language, post.description),
		author: localizeLangVar(language, post.author),
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

export function preparePageData(url: URL, language: Language, post: Post, content: PostContent) {
	const lPost = localizePost(language, post);
	const currentBlogRoute = ROUTE_MAP.blog[language];
	const canonicalPath = `${currentBlogRoute.path}/${lPost.slug}`;
	const canonicalUrl = `${url.origin}${canonicalPath}`;

	const delocalizedSlug = delocalizeLangVar(post.slug);
	const delocalizedTitle = delocalizeLangVar(post.title);
	return {
		route: {
			current: {
				key: delocalizedSlug.en,
				label: lPost.title,
				path: canonicalPath,
			},
			alternate: {
				en: {
					label: delocalizedTitle.en,
					path: `${ROUTE_MAP.blog.en.path}/${delocalizedSlug.en}`,
				},
				vi: {
					label: delocalizedTitle.vi,
					path: `${ROUTE_MAP.blog.vi.path}/${delocalizedSlug.vi}`,
				},
			},
		} as App.PageData['route'],
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
			canonical: canonicalUrl,
			structured: JSON.stringify([
				{
					'@context': 'https://schema.org',
					'@type': 'BreadcrumbList',
					itemListElement: [
						{
							'@type': 'ListItem',
							position: 1,
							name: currentBlogRoute.label,
							item: `${url.origin}${currentBlogRoute.path}`,
						},
						{
							'@type': 'ListItem',
							position: 2,
							name: lPost.title,
							item: canonicalUrl,
						},
					],
				} as WithContext<BreadcrumbList>,
				{
					'@context': 'https://schema.org',
					'@type': 'BlogPosting',
					'@id': `${canonicalUrl}/#BlogPosting`,
					url: canonicalUrl,
					mainEntityOfPage: canonicalUrl,
					headline: lPost.title,
					name: lPost.title,
					description: lPost.description,
					datePublished: lPost.date,
					dateModified: lPost.date,
					image: url.origin + lPost.ogImage,
					author: lPost.authors.map((author) => structurePerson(url, author)),
					inLanguage: language,
					publisher: SVELTE_VIETNAM_ORG,
					isPartOf: SVELTE_VIETNAM_BLOG,
					wordCount: lPost.wordCount,
					keywords: lPost.keywords,
				} as WithContext<BlogPosting>,
			]),
		} satisfies App.PageData['meta'],
	};
}

const MAX_IN_SERIES_COUNT = 3;

export function findPostBySlug(posts: Post[], slug?: string) {
	if (!slug) return undefined;
	return posts.find((p) => LANGUAGES.some((lang) => localizeLangVar(lang, p.slug) === slug));
}

export function isSamePost(lang: Language, post1: Post, post2: Post) {
	return localizeLangVar(lang, post1.slug) === localizeLangVar(lang, post2.slug);
}

export function isSameSeries(lang: Language, series1: PostSeries, series2: PostSeries) {
	return localizeLangVar(lang, series1.slug) === localizeLangVar(lang, series2.slug);
}

export function isUrlBlogPost(url: URL | string): boolean {
	return /^\/blog\/.+$/.test(
		delocalizeUrl(typeof url === 'string' ? url : url.pathname, LANGUAGES),
	);
}

/**
 * Search for at most 3 posts in the same series with the following algorithm:
 * - 1 is the latest post in the same series, if any,
 * - 2 is the post that comes right after the target post that is not 1, if any.
 * In case none is found, switch to 3, if any.
 * - 3 is the post that comes right before the target post, if any. If same as 2, take the next one, if any.
 *
 * If multiple series, return an array of at most 3 posts for each series
 */
export function searchPostsInSameSeries(lang: Language, posts: Post[], post: Post) {
	const postsInSameSeries: Post[][] = [];

	if (!post.series?.length) return postsInSameSeries;

	let remainingPosts = [...posts];
	let indexOfPost = remainingPosts.findIndex((p) => isSamePost(lang, p, post));
	if (indexOfPost === -1) return postsInSameSeries;

	let matchedPosts: Post[] = [];
	for (const series of post.series) {
		let left = indexOfPost - 1;
		let right = indexOfPost + 1;

		const leftBound = remainingPosts.findIndex(
			(p) => p.series?.some((s) => isSameSeries(lang, s, series)),
		);
		if (leftBound !== -1) {
			const latestPostInSeries = remainingPosts[leftBound];
			if (!isSamePost(lang, latestPostInSeries, post)) {
				matchedPosts.push(latestPostInSeries);
			}
		}

		while (left > leftBound || right < remainingPosts.length) {
			if (left > leftBound) {
				const leftPost = remainingPosts[left];
				if (leftPost?.series?.some((s) => isSameSeries(lang, s, series))) {
					matchedPosts.push(leftPost);
					if (matchedPosts.length >= MAX_IN_SERIES_COUNT) break;
				}
				left--;
			}

			if (right < remainingPosts.length) {
				const rightPost = remainingPosts[right];

				if (rightPost?.series?.some((s) => isSameSeries(lang, s, series))) {
					matchedPosts.push(rightPost);
					if (matchedPosts.length >= MAX_IN_SERIES_COUNT) break;
				}

				right++;
			}
		}

		if (matchedPosts.length) {
			postsInSameSeries.push(matchedPosts);
			remainingPosts = remainingPosts.filter(
				(p) => !matchedPosts.some((_p) => isSamePost(lang, p, _p)),
			);
			indexOfPost = remainingPosts.findIndex((p) => isSamePost(lang, p, post));
			matchedPosts = [];
		}
	}

	return postsInSameSeries.sort((a, b) => b.length - a.length);
}
