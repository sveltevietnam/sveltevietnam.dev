import * as m from '$data/locales/generated/messages';
import * as p from '$data/routes/generated';
import * as b from '$data/routes/generated/breadcrumbs';
import { getBackend } from '$lib/backend/utils';
import { JOB_POSTING_TYPE_LABEL } from '$lib/forms/job-posting-upsert';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, locals }) => {
	const { lang } = params;
	const user = locals.user!;
	const postings = (await getBackend().jobPostings().getAllByEmployerId(user.id)).map(
		(posting) => ({
			...posting,
			href: p['/:lang/postings/:id']({ lang, id: posting.id }),
			postedAt: posting.approvedAt,
			type: JOB_POSTING_TYPE_LABEL[posting.type](lang).toString(),
			employer: {
				name: user.name,
				image: user.image,
				website: user.website,
			},
		}),
	);
	const expired: typeof postings = [];
	const pending: typeof postings = [];
	const active: typeof postings = [];
	for (const posting of postings) {
		if (posting.expiredAt < new Date()) {
			expired.push(posting);
		} else if (!posting.approvedAt) {
			pending.push(posting);
		} else {
			active.push(posting);
		}
	}
	return {
		active,
		expired,
		pending,
		routing: {
			breadcrumbs: b['/:lang/postings']({ lang }),
			paths: {
				vi: p['/:lang/postings']({ lang: 'vi' }),
				en: p['/:lang/postings']({ lang: 'en' }),
			},
		},
		meta: {
			title: m['pages.postings.meta.title'](lang).toString(),
		},
	};
};
