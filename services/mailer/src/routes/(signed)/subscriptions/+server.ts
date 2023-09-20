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
import { createMailerSvelteKitError } from '$server/errors';

import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ request, locals }) => {
  const token = request.headers.get(COMMON_HEADERS.TOKEN);
  if (!token) throw createMailerSvelteKitError('SUBSCRIPTION_GET_NO_TOKEN');

  const isValid = await jwt.verify(token, JWT_SECRET);
  if (!isValid) throw createMailerSvelteKitError('SUBSCRIPTION_GET_INVALID_TOKEN');

  const { payload } = jwt.decode(token);
  const email = payload.email as string;
  if (!email) throw createMailerSvelteKitError('SUBSCRIPTION_GET_NOT_FOUND');

  const subscription = await getSubscriptionByEmail(locals.d1, email);
  if (!subscription) throw createMailerSvelteKitError('SUBSCRIPTION_GET_NOT_FOUND');

  const parsed = GetSubscriptionResponseSchema.strip().safeParse(subscription);
  if (!parsed.success) throw createMailerSvelteKitError('SUBSCRIPTION_GET_PARSE_ERROR');

  return json({ success: true, data: parsed.data } satisfies GetSubscriptionResponseDTO);
};

export const POST: RequestHandler = async ({ request, locals, fetch }) => {
  const parsed = CreateSubscriptionRequestSchema.safeParse(await request.json());
  if (!parsed.success) {
    throw createMailerSvelteKitError(
      'SUBSCRIPTION_CREATE_INVALID_INPUT',
      parsed.error.errors[0]?.message,
    );
  }

  const { d1 } = locals;
  const { email, domain, name, language } = parsed.data;

  // pass through if email has already been registered for this domain
  const subscription = await getSubscriptionByEmail(d1, email);
  if (subscription?.[domain]) {
    throw createMailerSvelteKitError('SUBSCRIPTION_CREATE_ALREADY_EXISTS');
  }

  // otherwise upsert subscription
  await upsertSubscription(d1, domain, { name, email });

  // TODO: message queue, retry?
  const sendRequest = await createSendRequest(
    {
      templateId: 'SUBSCRIPTION_SUCCESS',
      to: { email, name },
      language,
    },
    'internal',
  );
  const url = new URL(sendRequest.url);
  fetch(url.pathname, sendRequest);

  return json({ success: true } satisfies CreateSubscriptionResponseDTO, { status: 201 });
};

export const PATCH: RequestHandler = async ({ request, locals }) => {
  const token = request.headers.get(COMMON_HEADERS.TOKEN);
  if (!token) throw createMailerSvelteKitError('SUBSCRIPTION_DOMAIN_UPDATE_NO_TOKEN');

  const isValid = await jwt.verify(token, JWT_SECRET);
  if (!isValid) throw createMailerSvelteKitError('SUBSCRIPTION_DOMAIN_UPDATE_INVALID_TOKEN');

  const parsed = UpdateDomainSubscriptionRequestSchema.safeParse(await request.json());
  if (!parsed.success) {
    throw createMailerSvelteKitError('SUBSCRIPTION_DOMAIN_UPDATE_INVALID_INPUT');
  }

  const { payload } = jwt.decode(token);
  const email = payload.email as string;
  if (!email) throw createMailerSvelteKitError('SUBSCRIPTION_DOMAIN_UPDATE_NOT_FOUND');

  await updateDomainSubscription(locals.d1, email, parsed.data);
  return json({ success: true } satisfies UpdateDomainSubscriptionResponseDTO);
};
