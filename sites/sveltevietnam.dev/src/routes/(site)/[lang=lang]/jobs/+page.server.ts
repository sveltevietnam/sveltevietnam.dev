import * as m from '$data/locales/generated/messages';
import * as p from '$data/routes/generated';
import * as b from '$data/routes/generated/breadcrumbs';
import { upsert } from '$lib/forms/subscriber/server';

import type { Actions, PageServerLoad } from './$types';
import ogImageEn from './_page/images/og-jobs.en.jpg?url';
import ogImageVi from './_page/images/og-jobs.vi.jpg?url';

const ogImage = {
	vi: ogImageVi,
	en: ogImageEn,
};

export const load: PageServerLoad = async ({ params }) => {
	const { lang } = params;
	return {
		subscribeFormData: await upsert.load(lang, 'job'),
		routing: {
			breadcrumbs: b['/:lang/jobs']({ lang }),
			paths: {
				vi: p['/:lang/jobs']({ lang: 'vi' }),
				en: p['/:lang/jobs']({ lang: 'en' }),
			},
		},
		meta: {
			title: m['pages.jobs.title'](lang),
			description: m['pages.jobs.desc'](lang),
			keywords: m['pages.jobs.keywords'](lang),
			og: {
				image: ogImage[lang],
			},
		},
	};
};

export const actions: Actions = { subscribe: upsert.action };
