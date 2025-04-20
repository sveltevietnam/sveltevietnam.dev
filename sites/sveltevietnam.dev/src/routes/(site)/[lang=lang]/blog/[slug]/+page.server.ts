import { error } from '@sveltejs/kit';

import {
	loadBlogPostBySlug,
	loadBlogPostMetadata,
	ids,
	loadBlogPost,
	searchPostsInSameSeries,
	loadBlogPostOgImage,
} from '$data/blog/posts';
import { loadPersonAvatar } from '$data/people';
import * as p from '$data/routes/generated';
import * as b from '$data/routes/generated/breadcrumbs';
import { VITE_PUBLIC_ORIGIN } from '$env/static/public';
import { LOAD_DEPENDENCIES } from '$lib/constants';
import { buildStructuredBlogPost } from '$lib/meta/structured/blog';

import ogImageEn from '../(listing)/_page/og-blog.en.jpg?url';
import ogImageVi from '../(listing)/_page/og-blog.vi.jpg?url';

const ogImageFallback = {
	vi: ogImageVi,
	en: ogImageEn,
};

import type { PageServerLoad } from './$types';

// TODO: export `entries` to support prerendering, once routing strategy has matured
// @see {@link https://svelte.dev/docs/kit/page-options#entries}

export const load: PageServerLoad = async ({ params, locals, depends }) => {
	depends(LOAD_DEPENDENCIES.LANGUAGE);

	const lang = locals.sharedSettings.language;
	const post = await loadBlogPostBySlug(params.slug, lang);
	if (!post) {
		// TODO: assign a unique code to this error
		error(404, { message: 'Post not found', code: 'SV000' });
	}

	const latestPostId = ids[0] === post.id ? ids[1] : ids[0];
	const otherLang = lang === 'en' ? 'vi' : 'en';
	const [latest, inSeries, otherLangMetadata, ogImage] = await Promise.all([
		loadBlogPost(latestPostId, lang),
		searchPostsInSameSeries(
			lang,
			post.id,
			post.series.map((s) => s.id),
		),
		loadBlogPostMetadata(post.id, otherLang),
		loadBlogPostOgImage(post.id),
		...post.authors.map(async (author) => {
			const avatar = await loadPersonAvatar(author.id);
			author.avatar = avatar;
		}),
	]);

	const breadcrumbs = b['/:lang/blog/:slug']({
		lang,
		slug: [post.slug, post.title],
	});
	const paths = {
		[lang]: p['/:lang/blog/:slug']({ lang, slug: post.slug }),
		[otherLang]: p['/:lang/blog/:slug']({
			lang: otherLang,
			slug: otherLangMetadata?.slug ?? post.slug,
		}),
	} as Record<App.Language, string>;

	return {
		contentEditUrl: `https://github.com/sveltevietnam/sveltevietnam.dev/edit/v1/sites/sveltevietnam.dev/src/data/blog/posts/${post.id}/content/${lang}.md.svelte`,
		lang,
		post,
		posts: {
			latest,
			inSeries,
		},
		routing: { breadcrumbs, paths },
		meta: {
			structured: buildStructuredBlogPost(lang, VITE_PUBLIC_ORIGIN, post),
			title: `${post.title}`,
			description: post.description,
			keywords: post.keywords,
			og: {
				image: ogImage ?? ogImageFallback[lang],
			},
		},
	};
};
