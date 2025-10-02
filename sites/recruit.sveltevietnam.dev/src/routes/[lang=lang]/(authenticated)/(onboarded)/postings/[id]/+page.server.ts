import { error, redirect } from '@sveltejs/kit';
import { fail, superValidate } from 'sveltekit-superforms';
import { valibot } from 'sveltekit-superforms/adapters';
import * as v from 'valibot';

import * as m from '$data/locales/generated/messages';
import * as p from '$data/routes/generated';
import * as b from '$data/routes/generated/breadcrumbs';
import { getBackend } from '$lib/backend/utils';

import type { Actions, PageServerLoad } from './$types';

function createJobPostingDeleteSchema() {
	return v.object({ id: v.string() });
}

export const load: PageServerLoad = async ({ params, parent }) => {
	const { lang, id } = params;
	const parentData = await parent();

	const schema = createJobPostingDeleteSchema();
	return {
		...parentData,
		deleteForm: await superValidate({ id }, valibot(schema)),
		routing: {
			breadcrumbs: b['/:lang/postings/:id']({ lang, id: [id, parentData.posting.title] }),
			paths: {
				vi: p['/:lang/postings/:id']({ lang: 'vi', id }),
				en: p['/:lang/postings/:id']({ lang: 'en', id }),
			},
		},
	};
};

export const actions: Actions = {
	delete: async ({ params, locals, request }) => {
		const { lang } = params;

		const employerId = locals.user?.id;
		if (!employerId) throw redirect(302, p['/:lang/authenticate']({ lang }));

		const jobPostings = getBackend().jobPostings();

		const schema = v.objectAsync({
			id: v.pipeAsync(
				createJobPostingDeleteSchema().entries.id,
				v.checkAsync(async (id) => {
					const jobPostingEmployerId = await jobPostings.getEmployerIdById(id);
					return jobPostingEmployerId !== null && jobPostingEmployerId === employerId;
				}, m['pages.postings_id.delete.errors.unauthorized'](lang)),
			),
		});
		const form = await superValidate(request, valibot(schema));
		if (!form.valid) {
			return fail(400, { form });
		}

		const ok = await jobPostings.deleteById(form.data.id);
		if (!ok) {
			error(500, { code: 'SV001', message: 'Unknown sever error' });
		}

		return { form };
	},
};
