import { error } from '@sveltejs/kit';
import type { Language } from '@sveltevietnam/i18n';

import { searchBlogPosts } from '$data/blog/posts';
import { loadEventsByPersonId } from '$data/events';
import { loadPerson } from '$data/people';
import * as p from '$data/routes/generated';
import * as b from '$data/routes/generated/breadcrumbs';
import { VITE_PUBLIC_ORIGIN } from '$env/static/public';
import { buildStructuredPerson } from '$lib/meta/structured/people';
import { getPaginationFromUrl } from '$lib/utils/url';

import ogImageEn from '../_page/og-people.en.jpg?url';
import ogImageVi from '../_page/og-people.vi.jpg?url';

import type { PageServerLoad } from './$types';

const ogImage = {
	vi: ogImageVi,
	en: ogImageEn,
};

export const load: PageServerLoad = async ({ url, params }) => {
	const { lang } = params;
	const person = await loadPerson(params.id, lang, true);
	if (!person) {
		// TODO: assign a unique code to this error
		error(404, { message: 'Author not found', code: 'SV000' });
	}

	const otherLang = lang === 'en' ? 'vi' : 'en';
	const pagination = getPaginationFromUrl(url);
	const [{ events }, { posts, total }] = await Promise.all([
		loadEventsByPersonId(lang, person.id, 1, 4),
		searchBlogPosts({
			lang,
			pagination: {
				per: pagination.per,
				page: pagination.current,
			},
			where: {
				authorId: person.id,
			},
		}),
	]);

	const breadcrumbs = b['/:lang/people/:id']({
		lang,
		id: [person.id, person.name],
	});
	const paths = {
		[lang]: p['/:lang/people/:id']({ lang, id: person.id }),
		[otherLang]: p['/:lang/people/:id']({ lang: otherLang, id: person.id }),
	} as Record<Language, string>;

	return {
		person,
		events,
		posts,
		routing: { breadcrumbs, paths },
		pagination: {
			...pagination,
			max: Math.ceil(total / pagination.per),
		},
		meta: {
			structured: buildStructuredPerson(lang, VITE_PUBLIC_ORIGIN, person),
			title: `${person.name} | Svelte Vietnam`,
			description: person.description,
			og: {
				image: person.ogImage ?? ogImage[lang],
			},
		},
	};
};
