import { LANGUAGES } from '@sveltevietnam/kit/constants';
import * as v from 'valibot';

export const LanguageSchema = v.picklist(LANGUAGES);
export const OptionalModulesSchema = v.object({
	thumbnail: v.boolean(),
	ogImage: v.boolean(),
});
export const PaginationSchema = v.object({
	per: v.number(),
	page: v.number(),
});
