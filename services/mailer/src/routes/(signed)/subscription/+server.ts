import {
  CreateSubscriptionSchema,
  type CreateSubscriptionResponseDTO,
  createSendRequest,
} from '@internals/isc/mailer';
import { json } from '@sveltejs/kit';

import { getSubscriptionByEmail, upsertSubscription } from '$server/daos/subscriptions.dao';
import { createMailerSvelteKitError } from '$server/errors';

import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, locals, fetch }) => {
  const parsed = CreateSubscriptionSchema.safeParse(await request.json());
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
