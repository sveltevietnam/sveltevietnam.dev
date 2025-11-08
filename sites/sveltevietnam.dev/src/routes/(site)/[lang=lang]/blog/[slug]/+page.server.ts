import type { Language } from '@sveltevietnam/kit/constants';

import { getBlogPostBySlug } from '$data/blog/posts';
import {
	generateKitEntries,
	loadBlogPostMetadata,
	loadBlogPostOgImage,
} from '$data/blog/posts/entries';
import { loadPersonAvatar } from '$data/people/entries';
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

export const load: PageServerLoad = async (event) => {
	const { lang, slug } = event.params;
	const post = await getBlogPostBySlug({ slug });

	const otherLang = lang === 'en' ? 'vi' : 'en';
	const [otherLangMetadata, ogImage] = await Promise.all([
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
	} as Record<Language, string>;

	return {
		contentEditUrl: `https://github.com/sveltevietnam/sveltevietnam.dev/edit/main/sites/sveltevietnam.dev/src/data/blog/posts/entries/${post.id}/content/${lang}.md.svelte`,
		lang,
		post,
		routing: { breadcrumbs, paths },
		meta: {
			structured: buildStructuredBlogPost(lang, VITE_PUBLIC_ORIGIN, post),
			title: `${post.title}`,
			description: post.description,
			keywords: post.keywords,
			og: {
				image: {
					src: ogImage ?? ogImageFallback[lang],
				},
			},
		},
	};
};
