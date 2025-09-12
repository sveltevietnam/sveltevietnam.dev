import type { JobPostingData } from '@sveltevietnam/kit/components';

import * as p from '$data/routes/generated';
import * as b from '$data/routes/generated/breadcrumbs';

import type { PageServerLoad } from './$types';

function createMockPostings(num = 9): JobPostingData[] {
	const postings: JobPostingData[] = [];

	for (let i = 1; i <= num; i++) {
		const id = crypto.randomUUID();
		postings.push({
			id,
			href: p['/:lang/postings/:id']({ lang: 'en', id }),
			title: `Senior Frontend Developer ${i}`,
			type: 'Fulltime',
			location: 'Hanoi, Vietnam',
			salary: 'Up to $2000',
			postedAt: new Date(Date.now() - i * 86400000), // Posted i days ago
			expiredAt: new Date(Date.now() + (30 - i) * 86400000), // Expires in (30 - i) days
			employer: {
				name: `Company ${i}`,
				website: `https://sveltevietnam.dev`,
			},
		});
	}

	return postings;
}

export const load: PageServerLoad = ({ params }) => {
	// TODO: remember to map enum value to actual i18n-aware string
	const { lang } = params;
	return {
		postings: createMockPostings(),
		routing: {
			breadcrumbs: b['/:lang/postings']({ lang }),
			paths: {
				vi: p['/:lang/postings']({ lang: 'vi' }),
				en: p['/:lang/postings']({ lang: 'en' }),
			},
		},
	};
};
