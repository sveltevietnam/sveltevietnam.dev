import {
  subscriptionSchema,
  type SubscriptionResponseDTO,
  createMailerErrorResponse,
} from '@internals/isc/mailer';
import { json } from '@sveltejs/kit';

import { getSubscriptionByEmail, upsertSubscription } from '$server/daos/subscriptions.dao';

import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, locals }) => {
  const parsed = subscriptionSchema.safeParse(await request.json());
  if (!parsed.success) {
    return createMailerErrorResponse(
      'SUBSCRIPTION_INVALID_INPUT',
      parsed.error.errors.map((e) => e.message),
    );
  }

  const { d1 } = locals;
  const { email, domain, name } = parsed.data;

  try {
    // pass through if email has already been registered for this domain
    const subscription = await getSubscriptionByEmail(d1, email);
    if (subscription?.[domain]) {
      return createMailerErrorResponse('SUBSCRIPTION_EXISTS');
    }

    // otherwise upsert subscription
    await upsertSubscription(d1, domain, { name, email });
  } catch (e) {
    // add error capturing
    console.error(e);
    return createMailerErrorResponse('SUBSCRIPTION_UNKNOWN_ERROR');
  }

  return json({ success: true } satisfies SubscriptionResponseDTO, { status: 201 });
};
