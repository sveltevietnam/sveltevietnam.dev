import { error } from '@sveltejs/kit';
import { JOB_POSTING_TYPE_I18N } from '@sveltevietnam/backend/data/job-postings/enums';

import * as p from '$data/routes/generated';
import * as b from '$data/routes/generated/breadcrumbs';
import { VITE_PUBLIC_RECRUIT_ORIGIN } from '$env/static/public';
import { getBackend } from '$lib/backend/utils';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	const { lang, id } = event.params;
	const posting = await getBackend().jobPostings().getById(id);
	if (!posting || !(posting.status === 'active' || posting.status === 'expired')) {
		// TODO: assign a unique code to this error
		error(404, {
			message:
				lang === 'en'
					? 'Job posting is not found or has been deleted'
					: 'Tin tuyển dụng không tồn tại hoặc đã bị xóa',
			code: 'SV000',
		});
	}
	return {
		routing: {
			breadcrumbs: b['/:lang/jobs/:id']({ lang, id: [posting.id, posting.title] }),
			paths: {
				vi: p['/:lang/jobs/:id']({ lang: 'vi', id }),
				en: p['/:lang/jobs/:id']({ lang: 'en', id }),
			},
		},
		posting: {
			...posting,
			type: JOB_POSTING_TYPE_I18N[posting.type][lang],
			employer: {
				...posting.employer,
				...(posting.employer.image && {
					image: VITE_PUBLIC_RECRUIT_ORIGIN + posting.employer.image,
				}),
			},
		},
	};
};
