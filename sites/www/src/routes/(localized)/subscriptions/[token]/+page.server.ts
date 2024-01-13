import {
	createGetSubscriptionRequest,
	UpdateDomainSubscriptionRequestSchema,
	type GetSubscriptionResponseDTO,
	createUpdateDomainSubscriptionRequest,
	type UpdateDomainSubscriptionResponseDTO,
} from '@internals/isc/mailer';
import { error, fail } from '@sveltejs/kit';
import { message, superValidate } from 'sveltekit-superforms/server';

import { MAILER_CLIENT_ID, MAILER_CLIENT_SECRET, MAILER_SERVICE_URL } from '$env/static/private';
import type { FormMessage } from '$lib/forms';
import { LOAD_DEPENDENCIES } from '$shared/constants';

import type { Actions, PageServerLoad } from './$types';
import { translations as pageT } from './_page/translation';

const metaTranslations = {
	vi: {
		title: 'Đăng ký | Svelte Việt Nam',
		description: 'Quản lý đăng kí email',
	},
	en: {
		title: 'Subscription | Svelte Vietnam',
		description: 'Email subscription settings',
	},
};

export const prerender = false;
export const load: PageServerLoad = async ({
	depends,
	locals: { language },
	params: { token },
	fetch,
}) => {
	depends(LOAD_DEPENDENCIES.LANGUAGE);

	const response = await fetch(
		await createGetSubscriptionRequest({
			clientID: MAILER_CLIENT_ID,
			clientSecret: MAILER_CLIENT_SECRET,
			serviceURL: MAILER_SERVICE_URL,
			token,
		}),
	);
	const json = (await response.json()) as GetSubscriptionResponseDTO;
	if (!json.success) error(response.status, json.code);

	const form = await superValidate(json.data, UpdateDomainSubscriptionRequestSchema);

	return {
		form,
		translations: {
			page: pageT[language],
		},
		events: {
			upcoming: [],
			past: [],
		},
		meta: {
			...metaTranslations[language],
			canonical: `${url.origin}/${language}/subscriptions`,
		},
	};
};

export const actions: Actions = {
	update: async ({ request, locals: { language }, params: { token } }) => {
		const form = await superValidate<typeof UpdateDomainSubscriptionRequestSchema, FormMessage>(
			request,
			UpdateDomainSubscriptionRequestSchema,
		);
		if (!form.valid) {
			return fail(400, { form });
		}

		const t = pageT[language];

		const response = await fetch(
			await createUpdateDomainSubscriptionRequest(form.data, {
				clientID: MAILER_CLIENT_ID,
				clientSecret: MAILER_CLIENT_SECRET,
				serviceURL: MAILER_SERVICE_URL,
				token,
			}),
		);
		const json = (await response.json()) as UpdateDomainSubscriptionResponseDTO;

		if (!json.success) {
			return message(form, {
				type: 'error',
				text: `${t.errors.unknown} [CODE: ${json.code}]`,
			});
		}

		return message(form, {
			type: 'success',
			text: t.success,
		});
	},
};
