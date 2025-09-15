import { superValidate } from 'sveltekit-superforms';
import { valibot } from 'sveltekit-superforms/adapters';
import * as v from 'valibot';

import * as p from '$data/routes/generated';
import * as b from '$data/routes/generated/breadcrumbs';

import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const { lang, id } = params;

	// TODO: get this form DB of current user
	const posting = {
		id,
		title: 'Senior Frontend Developer (Svelte+SvelteKit)',
		type: 'full-time' as const,
		location: 'Hà Nội, Đà Nẵng, Hồ Chí Mình (Remote/Hybrid)',
		salary: 'Up to $3000/month',
		applicationMethod: 'url' as const,
		applicationLink: 'https://sveltevietnam.dev',
		postedAt: new Date(),
		expiredAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
		employer: {
			name: 'Company XYZ ABC',
			image: undefined,
			website: 'https://company.xyz',
		},
		href: p['/:lang/postings/:id']({ lang, id }),
	};

	const deleteSchema = v.object({
		id: v.pipe(v.string(), v.nonEmpty()),
	});
	return {
		posting,
		deleteForm: await superValidate({ id: posting.id }, valibot(deleteSchema)),
		routing: {
			breadcrumbs: b['/:lang/postings/:id']({ lang, id: [id, posting.title] }),
			paths: {
				vi: p['/:lang/postings/:id']({ lang: 'vi', id }),
				en: p['/:lang/postings/:id']({ lang: 'en', id }),
			},
		},
	};
};

export const actions: Actions = {
	delete: async () => {
		console.log('TODO: delete...');
	},
};
