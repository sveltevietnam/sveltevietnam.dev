// import {
// 	createSubscriptionRequest,
// 	MAILER_ERRORS,
// 	type CreateSubscriptionResponseDTO,
// } from '@internals/isc/mailer';
import {
	// error,
	fail,
} from '@sveltejs/kit';
// import type { NumericRange } from '@sveltejs/kit';
import { message, setError, superValidate } from 'sveltekit-superforms/server';

// import { MAILER_CLIENT_ID, MAILER_CLIENT_SECRET, MAILER_SERVICE_URL } from '$env/static/private';
import { mailSchema } from '$lib/components/MailRegistrationForm';
import { LOAD_DEPENDENCIES } from '$lib/constants';
import { createTicket, getTicket } from '$lib/daos/event_tickets.dao';
import { preparePageData } from '$lib/data/events';
import { throwSvelteKitError } from '$lib/errors';
import type { FormMessage } from '$lib/forms';
import { createMailTranslationAndSchema } from '$lib/forms/actions/mail/mail.server';
import { buildBreadcrumbs, type Breadcrumb } from '$lib/routing/routing.server';
import { validateToken } from '$lib/turnstile/turnstile.server';

import type { PageServerLoad } from './$types';
import { event, structure } from './_page/data';
import { EVENT_ID } from './_page/data';
import { translations as pageT } from './_page/translation';

export const load: PageServerLoad = async ({ url, depends, locals }) => {
	const lang = locals.settings.language;
	depends(LOAD_DEPENDENCIES.LANGUAGE);
	const prepared = preparePageData(url, lang, event, structure);
	const ticketForm = await superValidate(mailSchema);
	return {
		...prepared,
		breadcrumbs: [
			...buildBreadcrumbs(url.pathname),
			{ label: prepared.event.title },
		] satisfies Breadcrumb[],
		translations: {
			page: pageT[lang],
		},
		ticketForm,
	};
};

export const actions = {
	ticket: async ({ request, locals, fetch, platform }) => {
		// get cloudflare bindings for d1 database
		const d1 = platform?.env?.D1;
		if (!d1) throwSvelteKitError('D1_NOT_AVAILABLE');

		// create i18n-aware validation schema
		const { t, s } = createMailTranslationAndSchema(locals.settings.language);

		// parse form object
		const form = await superValidate<typeof s, FormMessage>(request, s);
		if (!form.valid) {
			return fail(400, { form });
		}

		// check cloudflare turnstile captcha
		const turnstile = await validateToken(form.data.turnstile);
		if (!turnstile.success) {
			setError(form, 'turnstile', turnstile.error?.[0] ?? t.error.captcha.unknown);
			return fail(400, { form });
		}

		const ticket = await getTicket(d1, form.data.email, EVENT_ID);
		if (ticket) {
			return message(form, {
				type: 'success',
				text: t.alreadyRegister,
			});
		}
		await createTicket(d1, {
			email: form.data.email,
			name: form.data.name,
			event: EVENT_ID,
			created_at: new Date().toISOString(),
		});
		// TODO: send mail

		// if (form.data.checkbox) {
		// 	const response = await fetch(
		// 		await createSubscriptionRequest(
		// 			{
		// 				email: form.data.email,
		// 				name: form.data.name,
		// 				domain: 'event',
		// 				language: locals.settings.language,
		// 			},
		// 			{
		// 				clientID: MAILER_CLIENT_ID,
		// 				clientSecret: MAILER_CLIENT_SECRET,
		// 				serviceURL: MAILER_SERVICE_URL,
		// 			},
		// 		),
		// 	);
		// 	const data = (await response.json()) as CreateSubscriptionResponseDTO;

		// 	if (!data.success) {
		// 		if (data.code === MAILER_ERRORS.SUBSCRIPTION_CREATE_ALREADY_EXISTS.code) {
		// 			return message(form, {
		// 				type: 'success',
		// 				text: t.alreadyRegister,
		// 			});
		// 		}
		// 		error(response.status as NumericRange<400, 599>, {
		// 			code: data.code,
		// 			message: '`${t.error.unknown} [CODE: ${data.code}]`',
		// 		});
		// 	}
		// }

		return message(form, {
			type: 'success',
			text: t.success,
		});
	},
};
