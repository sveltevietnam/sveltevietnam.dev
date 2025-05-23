import { error } from '@sveltejs/kit';

import {
	loadBlogPostBySlug,
	loadBlogPostMetadata,
	ids,
	loadBlogPost,
	searchPostsInSameSeries,
	loadBlogPostOgImage,
	generateKitEntries,
} from '$data/blog/posts';
import { loadPersonAvatar } from '$data/people';
import * as p from '$data/routes/generated';
import * as b from '$data/routes/generated/breadcrumbs';
import { VITE_PUBLIC_ORIGIN } from '$env/static/public';
import { buildStructuredBlogPost } from '$lib/meta/structured/blog';

import ogImageEn from '../(listing)/_page/og-blog.en.jpg?url';
import ogImageVi from '../(listing)/_page/og-blog.vi.jpg?url';

import type { EntryGenerator, PageServerLoad } from './$types';

const ogImageFallback = {
	vi: ogImageVi,
	en: ogImageEn,
};

export const entries: EntryGenerator = () => {
	return generateKitEntries();
};

export const load: PageServerLoad = async ({ params, platform }) => {
	const { lang } = params;
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

	let bluesky: { url: string; uri: string } | null = null;
	try {
		if (platform?.env?.backend) {
			const blueskyPost = await platform.env.backend.blueskyPosts().getByPostId(post.id);
			if (blueskyPost) {
				const { blueskyAccountId, blueskyPostId } = blueskyPost;
				bluesky = {
					url: `https://bsky.app/profile/${blueskyAccountId}/post/${blueskyPostId}`,
					uri: `at://${blueskyAccountId}/app.bsky.feed.post/${blueskyPostId}`,
				};
			}
		}
	} catch (e) {
		// if in dev, make sure you start the backend worker **beforehand**
		// i.e `cd workers/backend && pnpm dev:wrangler`
		console.error(e);
	}

	return {
		bluesky,
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
