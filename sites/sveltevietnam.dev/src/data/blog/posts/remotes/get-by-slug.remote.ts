import { error } from '@sveltejs/kit';
import * as v from 'valibot';

import { getRequestEvent, query } from '$app/server';
import { LanguageSchema } from '$lib/utils/schemas';

import { extendBlogPostMetadata, loadBlogPostMetadata, ids } from '../entries';

const GetBlogPostBySlugSchema = v.object({
	slug: v.string(),
	lang: v.optional(LanguageSchema),
});

export const getBlogPostBySlug = query(GetBlogPostBySlugSchema, async (input) => {
	const { locals } = getRequestEvent();
	const lang = input.lang ?? locals.language;
	const metadatas = (await Promise.all(ids.map((id) => loadBlogPostMetadata(id, lang)))).filter(
		Boolean,
	);
	const matched = metadatas.find((metadata) => metadata.slug.toString() === input.slug);
	if (!matched) {
		// TODO: assign a unique code to this error
		error(404, { message: 'Post not found', code: 'SV000' });
	}
	return extendBlogPostMetadata(matched, lang);
});
