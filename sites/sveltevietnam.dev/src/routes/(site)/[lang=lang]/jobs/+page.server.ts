import { JOB_POSTING_TYPE_I18N } from '@sveltevietnam/backend/data/job-postings/enums';
import type { JobPostingProps } from '@sveltevietnam/kit/components';

import * as p from '$data/routes/generated';
import * as b from '$data/routes/generated/breadcrumbs';
import { VITE_PUBLIC_RECRUIT_ORIGIN } from '$env/static/public';
import { getBackend } from '$lib/backend/utils';
import { upsert } from '$lib/forms/subscriber/server';
import * as m from '$lib/i18n/generated/messages';

import type { Actions, PageServerLoad } from './$types';
import ogImageEn from './_page/images/og-jobs.en.jpg?url';
import ogImageVi from './_page/images/og-jobs.vi.jpg?url';

const ogImage = {
	vi: ogImageVi,
	en: ogImageEn,
};

export const load: PageServerLoad = async (event) => {
	const { lang } = event.params;

	let postings: JobPostingProps['posting'][] = [];
	const backend = getBackend(event, false);
	if (backend) {
		postings = (await getBackend(event).jobPostings().getAllActive()).map((posting) => ({
			...posting,
			href: p['/:lang/jobs/:id']({ lang, id: posting.id }),
			postedAt: posting.approvedAt,
			type: JOB_POSTING_TYPE_I18N[posting.type][lang],
			employer: {
				...posting.employer,
				...(posting.employer.image && {
					image: VITE_PUBLIC_RECRUIT_ORIGIN + posting.employer.image,
				}),
			},
		}));
	}

	return {
		postings,
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
				image: {
					src: ogImage[lang],
				},
			},
		},
	};
};

export const actions: Actions = { subscribe: upsert.action };
