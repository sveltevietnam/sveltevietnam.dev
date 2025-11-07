import { error } from '@sveltejs/kit';
import * as v from 'valibot';

import { getRequestEvent, query } from '$app/server';
import { LanguageSchema, OptionalModulesSchema } from '$lib/utils/schemas';

import { loadBlogCategory } from '../entries';

const GetBlogCategoryBySlugSchema = v.object({
	id: v.string(),
	lang: v.optional(LanguageSchema),
	optionalModules: v.optional(v.partial(OptionalModulesSchema)),
});

export const getBlogCategoryById = query(GetBlogCategoryBySlugSchema, async (input) => {
	const { locals } = getRequestEvent();
	const { id, lang = locals.language, optionalModules } = input;
	const category = await loadBlogCategory(id, lang, optionalModules);
	if (!category) {
		// TODO: assign a unique code to this error
		error(404, { message: 'Category not found', code: 'SV000' });
	}
	return category;
});
