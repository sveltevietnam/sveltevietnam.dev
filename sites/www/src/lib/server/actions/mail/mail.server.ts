import {
  createSubscriptionRequest,
  MAILER_ERRORS,
  type CreateSubscriptionResponseDTO,
} from '@internals/isc/mailer';
import { error, fail } from '@sveltejs/kit';
import type { RequestEvent } from '@sveltejs/kit';
import { message, setError, superValidate } from 'sveltekit-superforms/server';
import { string, object } from 'zod';

import type { FormMessage } from '$client/forms';
import { MAILER_CLIENT_ID, MAILER_CLIENT_SECRET, MAILER_SERVICE_URL } from '$env/static/private';
import { validateToken } from '$server/services/turnstile';

import { translations } from './translation';

export async function mail<E extends RequestEvent>(event: E, domain: 'job' | 'event') {
  const { request, locals, fetch } = event;

  // create i18n-aware validation schema
  const t = translations[locals.language].validation;
  const schema = object({
    name: string({ invalid_type_error: t.error.captcha.required }).min(1, {
      message: t.error.name.required,
    }),
    email: string({ invalid_type_error: t.error.captcha.required })
      .min(1, { message: t.error.email.required })
      .email({ message: t.error.email.invalid }),
    turnstile: string({ invalid_type_error: t.error.captcha.required }).min(1, {
      message: t.error.captcha.required,
    }),
  });

  // parse form object
  const form = await superValidate<typeof schema, FormMessage>(request, schema);
  if (!form.valid) {
    return fail(400, { form });
  }

  // check cloudflare turnstile captcha
  const turnstile = await validateToken(form.data.turnstile);
  if (!turnstile.success) {
    setError(form, 'turnstile', turnstile.error?.[0] ?? t.error.captcha.unknown);
    return fail(400, { form });
  }

  const response = await fetch(
    await createSubscriptionRequest(
      {
        email: form.data.email,
        name: form.data.name,
        domain,
        language: locals.language,
      },
      {
        clientID: MAILER_CLIENT_ID,
        clientSecret: MAILER_CLIENT_SECRET,
        serviceURL: MAILER_SERVICE_URL,
      },
    ),
  );
  const data = (await response.json()) as CreateSubscriptionResponseDTO;

  if (!data.success) {
    if (data.code === MAILER_ERRORS.SUBSCRIPTION_CREATE_ALREADY_EXISTS.code) {
      return message(form, {
        type: 'success',
        text: t.alreadyRegister,
      });
    }
    throw error(response.status, `${t.error.unknown} [CODE: ${data.code}]`);
  }

  return message(form, {
    type: 'success',
    text: t.success,
  });
}
