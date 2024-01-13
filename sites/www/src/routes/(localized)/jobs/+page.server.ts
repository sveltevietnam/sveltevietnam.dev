import { superValidate } from 'sveltekit-superforms/server';

import { prepareRoutePageData } from '$client/contexts/navigation';
import ogImageEn from '$lib/assets/images/og/og-jobs.en.jpg';
import ogImageVi from '$lib/assets/images/og/og-jobs.vi.jpg';
import { mailSchema } from '$lib/components/MailRegistrationForm';
import { mail } from '$lib/forms/actions/mail/mail.server';
import { translations as tMail } from '$lib/forms/actions/mail/translation';
import { LOAD_DEPENDENCIES } from '$shared/constants';
import { buildBreadcrumbs } from '$shared/services/navigation/server';

import type { PageServerLoad, Actions } from './$types';
import { translations as tPage } from './_page/translation';

const metaTranslations = {
	vi: {
		title: 'Công việc | Svelte Việt Nam',
		description: 'Công việc dành cho lập trình viên Svelte tại Việt Nam',
		keywords: ['công việc', 'việc làm', 'tuyển dụng', 'dự án'],
		og: {
			image: ogImageVi,
		},
	},
	en: {
		title: 'Jobs | Svelte Vietnam',
		description: 'Job board for Svelte developers in Vietnam',
		keywords: ['job', 'work', 'employment', 'posting', 'recruitment', 'partner', 'project'],
		og: {
			image: ogImageEn,
		},
	},
};

export const load: PageServerLoad = async ({ url, depends, locals: { language } }) => {
	depends(LOAD_DEPENDENCIES.LANGUAGE);
	const mailForm = await superValidate(mailSchema);
	return {
		route: prepareRoutePageData(language, 'jobs'),
		breadcrumbs: buildBreadcrumbs(url.pathname),
		translations: {
			page: tPage[language],
			mail: tMail[language],
		},
		jobs: {
			fromSponsors: [],
			fromRecruitmentSites: {
				collectedAt: new Date('2023-11-07'),
				jobs: [],
			},
		},
		meta: metaTranslations[language],
		mailForm,
	};
};

export const actions: Actions = {
	mail: (event) => mail(event, 'job'),
};
