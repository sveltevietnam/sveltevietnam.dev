import { superValidate } from 'sveltekit-superforms/server';

import { prepareRoutePageData } from '$client/contexts/navigation';
import ogImageEn from '$lib/assets/images/og/og-events.en.jpg';
import ogImageVi from '$lib/assets/images/og/og-events.vi.jpg';
import { mailSchema } from '$lib/components/MailRegistrationForm';
import { LOAD_DEPENDENCIES } from '$lib/constants';
import { listEvents } from '$lib/data/events';
import { mail } from '$lib/forms/actions/mail/mail.server';
import { translations as mailT } from '$lib/forms/actions/mail/translation';
import type { Language } from '$shared/services/i18n';
import { buildBreadcrumbs } from '$shared/services/navigation/server';

import type { PageServerLoad, Actions } from './$types';
import { translations as pageT } from './_page/translation';

const metaTranslations: Record<Language, App.PageData['meta']> = {
	vi: {
		title: 'Sự kiện | Svelte Việt Nam',
		description: 'Gặp gỡ cộng đồng Svelte tại Việt Nam',
		keywords: ['sự kiện', 'cộng đồng', 'gặp mặt'],
		og: {
			image: ogImageVi,
		},
	},
	en: {
		title: 'Events | Svelte Vietnam',
		description: 'Meet up with people of Svelte in Vietnam',
		keywords: ['event', 'community', 'meetup'],
		og: {
			image: ogImageEn,
		},
	},
};

export const load: PageServerLoad = async ({ url, depends, locals: { language } }) => {
	depends(LOAD_DEPENDENCIES.LANGUAGE);
	const mailForm = await superValidate(mailSchema);
	return {
		route: prepareRoutePageData(language, 'events'),
		breadcrumbs: buildBreadcrumbs(url.pathname),
		translations: {
			page: pageT[language],
			mail: mailT[language],
		},
		events: listEvents(language),
		meta: metaTranslations[language],
		mailForm,
	};
};

export const actions: Actions = {
	mail: async (event) => mail(event, 'event'),
};
