import { error } from '@sveltejs/kit';

import { search } from '$data/blog/posts';
import { loadPerson } from '$data/people';
import { LOAD_DEPENDENCIES } from '$lib/constants';
import { buildStructuredPerson } from '$lib/meta/structured/people';
import { buildRoutes } from '$lib/routing/utils';
import { getPaginationFromUrl } from '$lib/utils/url';

import ogImageEn from '../_page/og-people.en.jpg?url';
import ogImageVi from '../_page/og-people.vi.jpg?url';

import type { PageServerLoad } from './$types';

const ogImage = {
	vi: ogImageVi,
	en: ogImageEn,
};

export const load: PageServerLoad = async ({ parent, url, locals, depends, params }) => {
	depends(LOAD_DEPENDENCIES.LANGUAGE);

	const lang = locals.sharedSettings.language;
	const person = await loadPerson(params.id, lang, {
		links: true,
		popImage: true,
	});
	if (!person) {
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
				authorId: person.id,
			},
		}),
		parent(),
	]);

	const routeParam = {
		name: person.name,
		path: person.id,
	};

	const paths = {
		// NOTE: for person, slug is same for both languages (person's id)
		// so we are skipping fetching other language's metadata
		en: buildRoutes(parentLoadData.routing.paths.en, routeParam),
		vi: buildRoutes(parentLoadData.routing.paths.vi, routeParam),
	};

	return {
		person,
		posts,
		routing: {
			...parentLoadData.routing,
			breadcrumbs: buildRoutes(parentLoadData.routing.breadcrumbs, routeParam),
			paths,
		},
		pagination: {
			...pagination,
			max: Math.ceil(total / pagination.per),
		},
		meta: {
			structured: buildStructuredPerson(lang, url.origin, person),
			title: `${person.name} | Svelte Vietnam`,
			description: person.description,
			og: {
				image: person.ogImage ?? ogImage[lang],
			},
		},
	};
};
