import { getSecretFromClientId } from '@internals/db/daos/isc_clients';
import {
	createGetSubscriptionRequest,
	UpdateDomainSubscriptionRequestSchema,
	type GetSubscriptionResponseDTO,
	createUpdateDomainSubscriptionRequest,
	type UpdateDomainSubscriptionResponseDTO,
} from '@internals/isc/mailer';
import { error, fail, type NumericRange } from '@sveltejs/kit';
import { message, superValidate } from 'sveltekit-superforms/server';

import { ISC_CLIENT_ID, MAILER_SERVICE_URL } from '$env/static/private';
import { LOAD_DEPENDENCIES } from '$lib/constants';
import { throwSvelteKitError } from '$lib/errors';
import type { FormMessage } from '$lib/forms';
import { prepareRoutePageData } from '$lib/routing/routing.server';

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
	locals,
	params: { token },
	fetch,
	platform,
}) => {
	// get cloudflare bindings for d1 database
	const d1 = platform?.env?.D1;
	if (!d1) throwSvelteKitError('D1_NOT_AVAILABLE');

	const lang = locals.settings.language;
	depends(LOAD_DEPENDENCIES.LANGUAGE);

	const clientSecret = await getSecretFromClientId(d1, ISC_CLIENT_ID);
	if (!clientSecret) throwSvelteKitError('ISC_CLIENT_SECRET_NOT_FOUND');

	const response = await fetch(
		await createGetSubscriptionRequest({
			clientID: ISC_CLIENT_ID,
			clientSecret,
			serviceURL: MAILER_SERVICE_URL,
			token,
		}),
	);
	const json = (await response.json()) as GetSubscriptionResponseDTO;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	if (!json.success) error(response.status as NumericRange<400, 599>, json.code as any);

	const form = await superValidate(json.data, UpdateDomainSubscriptionRequestSchema);

	const route = structuredClone(prepareRoutePageData(lang, 'subscriptions'));
	// CAUTION: cloning here to avoid mutating the original route
	route.current.path += `/${token}`;
	route.alternate.en.path += `/${token}`;
	route.alternate.vi.path += `/${token}`;

	return {
		route,
		form,
		translations: {
			page: pageT[lang],
		},
		events: {
			upcoming: [],
			past: [],
		},
		meta: metaTranslations[lang],
	};
};

export const actions: Actions = {
	update: async ({ request, locals, params: { token }, platform }) => {
		// get cloudflare bindings for d1 database
		const d1 = platform?.env?.D1;
		if (!d1) throwSvelteKitError('D1_NOT_AVAILABLE');

		const lang = locals.settings.language;
		const form = await superValidate<typeof UpdateDomainSubscriptionRequestSchema, FormMessage>(
			request,
			UpdateDomainSubscriptionRequestSchema,
		);
		if (!form.valid) {
			return fail(400, { form });
		}

		const t = pageT[lang];

		const clientSecret = await getSecretFromClientId(d1, ISC_CLIENT_ID);
		if (!clientSecret) throwSvelteKitError('ISC_CLIENT_SECRET_NOT_FOUND');

		const response = await fetch(
			await createUpdateDomainSubscriptionRequest(form.data, {
				clientID: ISC_CLIENT_ID,
				clientSecret,
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
