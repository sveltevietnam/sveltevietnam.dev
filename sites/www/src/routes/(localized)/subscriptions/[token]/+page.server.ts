import { getSubscriptionByEmail, updateDomainSubscription } from '@internals/db/daos/subscriptions';
import { fail } from '@sveltejs/kit';
import jwt from '@tsndr/cloudflare-worker-jwt';
import { message, superValidate } from 'sveltekit-superforms/server';
import { object as zObject, coerce as zCoerce } from 'zod';

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

const UpdateDomainSubscriptionRequestSchema = zObject({
	job: zCoerce.boolean(),
	event: zCoerce.boolean(),
	blog: zCoerce.boolean(),
});

export const prerender = false;
export const load: PageServerLoad = async ({ depends, locals, params: { token }, platform }) => {
	// get cloudflare bindings for d1 database
	const d1 = platform?.env?.D1;
	if (!d1) throwSvelteKitError('D1_NOT_AVAILABLE');

	const lang = locals.settings.language;
	depends(LOAD_DEPENDENCIES.LANGUAGE);

	// TODO: enable after 2024.04.20 (meetup event)
	// const mailerSecret = await getIscClientSecret(d1, ISC_MAILER_CLIENT_ID);
	// if (!mailerSecret) throwSvelteKitError('ISC_CLIENT_NOT_FOUND');
	// const isValid = await jwt.verify(token, mailerSecret);
	// if (!isValid) throwSvelteKitError('SUBSCRIPTION_INVALID_TOKEN');

	const { payload } = await jwt.decode<{ email: string }>(token);
	const email = payload?.email ?? payload?.sub;
	if (!email) throwSvelteKitError('SUBSCRIPTION_MISSING_EMAIL');

	const subscription = await getSubscriptionByEmail(d1, email);
	if (!subscription) throwSvelteKitError('SUBSCRIPTION_NOT_FOUND');

	const form = await superValidate(subscription, UpdateDomainSubscriptionRequestSchema);

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

		// TODO: enable after 2024.04.20 (meetup event)
		// const mailerSecret = await getIscClientSecret(d1, ISC_MAILER_CLIENT_ID);
		// if (!mailerSecret) throwSvelteKitError('ISC_CLIENT_NOT_FOUND');
		// const isValid = await jwt.verify(token, mailerSecret);
		// if (!isValid) throwSvelteKitError('SUBSCRIPTION_INVALID_TOKEN');

		const { payload } = await jwt.decode<{ email: string }>(token);
		const email = payload?.email ?? payload?.sub;
		if (!email) throwSvelteKitError('SUBSCRIPTION_MISSING_EMAIL');

		await updateDomainSubscription(d1, email, form.data);

		return message(form, {
			type: 'success',
			text: t.success,
		});
	},
};
