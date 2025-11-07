import { error } from '@sveltejs/kit';
import * as v from 'valibot';

import { getRequestEvent, query } from '$app/server';
import { LanguageSchema, OptionalModulesSchema } from '$lib/utils/schemas';

import { ids, loadBlogCategory } from '../entries';

import { getBlogCategoryById } from './get-by-id.remote';

const GetBlogCategoryBySlugSchema = v.object({
	slug: v.string(),
	lang: v.optional(LanguageSchema),
	optionalModules: v.optional(v.partial(OptionalModulesSchema)),
});

export const getBlogCategoryBySlug = query(GetBlogCategoryBySlugSchema, async (input) => {
	const { locals } = getRequestEvent();
	const { slug, lang = locals.language, optionalModules } = input;
	const categories = await Promise.all(ids.map((id) => loadBlogCategory(id, lang)));
	const category = categories.find((s) => s?.slug.toString() === slug);
	if (!category) {
		// TODO: assign a unique code to this error
		error(404, { message: 'Category not found', code: 'SV000' });
	}
	return getBlogCategoryById({ id: category.id, lang, optionalModules });
});
