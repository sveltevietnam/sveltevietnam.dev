import { error } from '@sveltejs/kit';
import * as v from 'valibot';

import { getRequestEvent, query } from '$app/server';
import { LanguageSchema } from '$lib/utils/schemas';

import { extendBlogPostMetadata, loadBlogPostMetadata } from '../entries';

const GetBlogPostById = v.object({
	id: v.string(),
	lang: v.optional(LanguageSchema),
});

export const getBlogPostById = query(GetBlogPostById, async (input) => {
	const { locals } = getRequestEvent();
	const lang = input.lang ?? locals.language;
	const metadata = await loadBlogPostMetadata(input.id, lang);
	if (!metadata) {
		// TODO: assign a unique code to this error
		error(404, { message: 'Post not found', code: 'SV000' });
	}
	return extendBlogPostMetadata(metadata, lang);
});
