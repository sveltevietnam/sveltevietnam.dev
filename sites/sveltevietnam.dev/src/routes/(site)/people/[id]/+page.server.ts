import { error } from '@sveltejs/kit';

import { search } from '$data/blog/posts';
import { loadPerson } from '$data/people';
import { LOAD_DEPENDENCIES } from '$lib/constants';
import { buildRoutes } from '$lib/routing/utils';
import { getPaginationFromUrl } from '$lib/utils/url';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ parent, url, locals, depends, params }) => {
	depends(LOAD_DEPENDENCIES.LANGUAGE);

	const lang = locals.sharedSettings.language;
	const author = await loadPerson(params.id, lang, true);
	if (!author) {
		// TODO: assign a unique code to this error
		error(404, { message: 'Author not found', code: 'SV000' });
	}

	const pagination = getPaginationFromUrl(url);
	const [{ posts, total }, parentLoadData] = await Promise.all([
		search({
			lang,
			pagination: {
				per: pagination.per,
				page: pagination.current,
			},
			where: {
				authorId: author.id,
			},
		}),
		parent(),
	]);

	const routeParam = {
		name: author.name,
		path: author.id,
	};

	return {
		author,
		posts,
		routing: {
			...parentLoadData.routing,
			breadcrumbs: buildRoutes(parentLoadData.routing.breadcrumbs, routeParam),
			paths: {
				// NOTE: for person, slug is same for both languages (person's id)
				// so we are skipping fetching other language's metadata
				en: buildRoutes(parentLoadData.routing.paths.en, routeParam),
				vi: buildRoutes(parentLoadData.routing.paths.vi, routeParam),
			},
		},
		pagination: {
			...pagination,
			max: Math.ceil(total / pagination.per),
		},
		meta: {
			title: `${author.name} | Svelte Vietnam`,
			description: author.description,
		},
	};
};
