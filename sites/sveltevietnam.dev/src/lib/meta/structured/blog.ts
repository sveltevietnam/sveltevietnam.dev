import type { Language } from '@sveltevietnam/i18n';
import { buildStructuredTextWithLang } from '@sveltevietnam/kit/utilities/structured-data';
import type { Thing, Blog, BlogPosting, CreativeWorkSeries, CollectionPage } from 'schema-dts';

import * as p from '$data/routes/generated';

import { buildStructuredOrganization } from './organization';
import { buildStructuredPerson } from './people';

const locales = {
	vi: {
		description:
			'Nơi chia sẻ về công nghệ và con người trong hệ sinh thái Svelte. Viết về trải nghiệm của bạn với Svelte hoặc cập nhật tin tức từ cộng đồng Svelte Việt Nam',
	},
	en: {
		description:
			'A community-driven blog about technical insights and human stories in the Svelte ecosystem. Share your Svelte experience or catch up on the latest news from Svelte Vietnam!',
	},
};

export function buildStructuredBlog(lang: Language, origin: string): Blog {
	const org = buildStructuredOrganization(lang, origin);
	const locale = locales[lang];
	return {
		'@type': 'Blog',
		'@id': `${org['@id']}/blog`,
		name: 'Svelte Việt Nam Blog',
		description: buildStructuredTextWithLang({ lang, value: locale.description }),
		publisher: org,
	};
}

export function buildStructuredBlogSeries(
	lang: Language,
	origin: string,
	series: import('$data/blog/series').BlogSeries,
	compact = false,
): CreativeWorkSeries {
	const { publisher, ...blog } = buildStructuredBlog(lang, origin);
	const canonical = origin + p['/:lang/blog/series/:slug']({ lang, slug: series.slug });
	return {
		'@type': 'CreativeWorkSeries',
		'@id': `${blog['@id']}/series/${series.id}`,
		url: buildStructuredTextWithLang({ lang, value: canonical }),
		name: buildStructuredTextWithLang({ lang, value: series.name }),
		description: buildStructuredTextWithLang({ lang, value: series.description }),
		...(!compact && {
			publisher,
			isPartOf: blog,
		}),
	};
}

export function buildStructuredBlogCategoryPage(
	lang: Language,
	origin: string,
	category: import('$data/blog/categories').BlogCategory,
	compact = false,
): CollectionPage {
	const canonical = origin + p['/:lang/blog/categories/:slug']({ lang, slug: category.slug });
	const { publisher, ...blog } = buildStructuredBlog(lang, origin);
	return {
		'@type': 'CollectionPage',
		'@id': `${origin}/blog/categories/${category.id}`,
		url: buildStructuredTextWithLang({ lang, value: canonical }),
		...(!compact && {
			name: buildStructuredTextWithLang({ lang, value: category.name }),
			description: buildStructuredTextWithLang({ lang, value: category.description }),
			publisher,
			isPartOf: blog,
		}),
	};
}

export function buildStructuredBlogCategory(
	lang: Language,
	origin: string,
	category: import('$data/blog/categories').BlogCategory,
): Thing {
	return {
		'@type': 'Thing',
		description: buildStructuredTextWithLang({ lang, value: category.description }),
		name: buildStructuredTextWithLang({ lang, value: category.name }),
		mainEntityOfPage: buildStructuredBlogCategoryPage(lang, origin, category, true),
	};
}

export function buildStructuredBlogPost(
	lang: Language,
	origin: string,
	post: import('$data/blog/posts').ExtendedBlogPostMetadata,
): BlogPosting {
	const canonical = origin + p['/:lang/blog/:slug']({ lang, slug: post.slug });
	const { publisher, ...blog } = buildStructuredBlog(lang, origin);
	const id = `${blog['@id']}/${post.id}`;

	return {
		'@type': 'BlogPosting',
		'@id': id,
		url: buildStructuredTextWithLang({ lang, value: canonical }),
		mainEntityOfPage: buildStructuredTextWithLang({ lang, value: canonical }),
		headline: buildStructuredTextWithLang({ lang, value: post.title }),
		name: buildStructuredTextWithLang({ lang, value: post.title }),
		description: buildStructuredTextWithLang({ lang, value: post.description }),
		datePublished: post.publishedAt.toISOString(),
		dateModified: post.updatedAt?.toISOString(),
		...(post.thumbnail && {
			image: {
				'@type': 'ImageObject',
				'@id': `${id}/image`,
				url: origin + post.thumbnail.img.src,
				width: post.thumbnail.img.w.toString(),
				height: post.thumbnail.img.h.toString(),
			},
		}),
		...(post.authors.length && {
			author: post.authors.map((author) => buildStructuredPerson(lang, origin, author)),
		}),
		inLanguage: lang,
		isPartOf: !post.series.length
			? blog
			: [
					...post.series.map((series) => buildStructuredBlogSeries(lang, origin, series, true)),
					blog,
				],
		publisher,
		keywords: post.keywords,
		wordCount: post.numWords,
		...(post.categories.length && {
			about: post.categories.map((category) => buildStructuredBlogCategory(lang, origin, category)),
		}),
	};
}
