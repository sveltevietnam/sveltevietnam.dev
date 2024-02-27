import { COMMON_HEADERS } from '@internals/isc/common';
import {
	CreateSubscriptionRequestSchema,
	type CreateSubscriptionResponseDTO,
	UpdateDomainSubscriptionRequestSchema,
	createSendRequest,
	GetSubscriptionResponseSchema,
	type GetSubscriptionResponseDTO,
	type UpdateDomainSubscriptionResponseDTO,
} from '@internals/isc/mailer';
import { json } from '@sveltejs/kit';
import jwt from '@tsndr/cloudflare-worker-jwt';

import { JWT_SECRET } from '$env/static/private';
import {
	getSubscriptionByEmail,
	updateDomainSubscription,
	upsertSubscription,
} from '$server/daos/subscriptions.dao';
import { throwMailerSvelteKitError } from '$server/errors';

import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ request, locals }) => {
	const token = request.headers.get(COMMON_HEADERS.TOKEN);
	if (!token) throwMailerSvelteKitError('SUBSCRIPTION_GET_NO_TOKEN');

	const isValid = await jwt.verify(token, JWT_SECRET);
	if (!isValid) throwMailerSvelteKitError('SUBSCRIPTION_GET_INVALID_TOKEN');

	const { payload } = jwt.decode<{ email: string }>(token);
	const email = payload?.email as string;
	if (!email) throwMailerSvelteKitError('SUBSCRIPTION_GET_NOT_FOUND');

	const subscription = await getSubscriptionByEmail(locals.d1, email);
	if (!subscription) throwMailerSvelteKitError('SUBSCRIPTION_GET_NOT_FOUND');

	const parsed = GetSubscriptionResponseSchema.strip().safeParse(subscription);
	if (!parsed.success) throwMailerSvelteKitError('SUBSCRIPTION_GET_PARSE_ERROR');

	return json({
		success: true,
		data: parsed.data,
	} satisfies GetSubscriptionResponseDTO);
};

export const POST: RequestHandler = async ({ request, locals, fetch }) => {
	const parsed = CreateSubscriptionRequestSchema.safeParse(await request.json());
	if (!parsed.success) {
		throwMailerSvelteKitError('SUBSCRIPTION_CREATE_INVALID_INPUT', parsed.error.errors[0]?.message);
	}

	const { d1 } = locals;
	const { email, domain, name, language } = parsed.data;

	// pass through if email has already been registered for this domain
	const subscription = await getSubscriptionByEmail(d1, email);
	if (domain && subscription?.[domain]) {
		throwMailerSvelteKitError('SUBSCRIPTION_CREATE_ALREADY_EXISTS');
	}

	// otherwise upsert subscription
	await upsertSubscription(d1, { name, email }, domain);

	// send welcome email if first time subscribing,
	// but only do so if user explicitly subscribed to one domain
	if (domain && !subscription?.email && !subscription?.job && !subscription?.blog) {
		// TODO: message queue, retry?
		const sendRequest = await createSendRequest(
			{
				templateId: 'WELCOME',
				to: { email, name },
				language,
				variables: { name },
			},
			'internal',
		);
		const url = new URL(sendRequest.url);
		await fetch(url.pathname, sendRequest).then(async (resp) => {
			if (!resp.ok) {
				const json = await resp.json();
				console.error('/send error:', json);
			}
		});
	}

	return json({ success: true } satisfies CreateSubscriptionResponseDTO, {
		status: 201,
	});
};

export const PATCH: RequestHandler = async ({ request, locals }) => {
	const token = request.headers.get(COMMON_HEADERS.TOKEN);
	if (!token) throwMailerSvelteKitError('SUBSCRIPTION_DOMAIN_UPDATE_NO_TOKEN');

	const isValid = await jwt.verify(token, JWT_SECRET);
	if (!isValid) throwMailerSvelteKitError('SUBSCRIPTION_DOMAIN_UPDATE_INVALID_TOKEN');

	const parsed = UpdateDomainSubscriptionRequestSchema.safeParse(await request.json());
	if (!parsed.success) {
		throwMailerSvelteKitError('SUBSCRIPTION_DOMAIN_UPDATE_INVALID_INPUT');
	}

	const { payload } = jwt.decode<{ email: string }>(token);
	const email = payload?.email as string;
	if (!email) throwMailerSvelteKitError('SUBSCRIPTION_DOMAIN_UPDATE_NOT_FOUND');

	await updateDomainSubscription(locals.d1, email, parsed.data);
	return json({ success: true } satisfies UpdateDomainSubscriptionResponseDTO);
};
