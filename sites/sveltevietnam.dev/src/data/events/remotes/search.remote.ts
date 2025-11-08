import * as v from 'valibot';

import { getRequestEvent, query } from '$app/server';
import { LanguageSchema, OptionalModulesSchema, PaginationSchema } from '$lib/utils/schemas';

import { EVENT_STATUSES } from '../constants';
import { loadEventMetadata, ids } from '../entries';
import { compareEventsByStartDate, getEventStatus } from '../utils';

import { getEventById } from './get-by-id.remote';

const SearchEventsSchema = v.object({
	lang: v.optional(LanguageSchema),
	pagination: v.optional(PaginationSchema),
	where: v.optional(
		v.object({
			people: v.optional(v.array(v.string())),
			status: v.optional(v.array(v.picklist(EVENT_STATUSES))),
		}),
	),
	optionalModules: v.optional(v.partial(OptionalModulesSchema)),
});

export const searchEvents = query(SearchEventsSchema, async (input) => {
	const { locals } = getRequestEvent();
	const { lang = locals.language, pagination, where, optionalModules } = input;

	const metadatas = (await Promise.all(ids.map((id) => loadEventMetadata(id, lang)))).filter(
		Boolean,
	);

	const matched = metadatas.filter((metadata) => {
		if (where?.status) {
			const status = getEventStatus(metadata);
			if (!where.status.includes(status)) return false;
		}
		if (where?.people?.length) {
			if (!metadata.people?.length) return false;

			const eventPersonSet = new Set(metadata.people);
			const wherePersonSet = new Set(where.people);
			if (eventPersonSet.intersection(wherePersonSet).size === 0) return false;
		}
		return true;
	});

	let paginated = matched.sort(compareEventsByStartDate);
	if (pagination) {
		const { per, page } = pagination;
		paginated = matched.slice(per * (page - 1), per * page);
	}

	return {
		events: await Promise.all(
			paginated.map((metadata) => getEventById({ id: metadata.id, lang, optionalModules })),
		),
		total: ids.length,
	};
});
