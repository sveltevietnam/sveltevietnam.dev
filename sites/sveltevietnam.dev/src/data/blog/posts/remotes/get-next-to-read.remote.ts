import * as v from 'valibot';

import { query } from '$app/server';
import { LanguageSchema } from '$lib/utils/schemas';

import { ids } from '../entries';

import { getBlogPostById } from './get-by-id.remote';

const GetBlogPostNextToReadSchema = v.object({
	postId: v.string(),
	lang: v.optional(LanguageSchema),
});

export const getBlogPostNextToRead = query(GetBlogPostNextToReadSchema, (input) => {
	const { postId, lang } = input;
	return getBlogPostById({
		id: ids[0] === postId ? ids[1] : ids[0],
		lang,
	});
});
