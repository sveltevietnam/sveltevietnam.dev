import { fail } from '@sveltejs/kit';
import type { RequestEvent } from '@sveltejs/kit';
import { setError, superValidate } from 'sveltekit-superforms/server';
import { z } from 'zod';

import { validateToken } from '$server/services/turnstile';

import { translations } from './translation';

export async function mail<E extends RequestEvent>(event: E, domain: 'job' | 'event') {
  const { request, locals } = event;

  const t = translations[locals.language].validation;
  const schema = z.object({
    name: z
      .string({ invalid_type_error: t.error.captcha.required })
      .min(1, { message: t.error.name.required }),
    email: z
      .string({ invalid_type_error: t.error.captcha.required })
      .min(1, { message: t.error.email.required })
      .email({ message: t.error.email.invalid }),
    turnstile: z
      .string({ invalid_type_error: t.error.captcha.required })
      .min(1, { message: t.error.captcha.required }),
  });

  const form = await superValidate(request, schema);

  if (!form.valid) {
    return fail(400, { form });
  }

  const turnstile = await validateToken(form.data.turnstile);
  if (!turnstile.success) {
    return setError(form, 'turnstile', turnstile.error?.[0] ?? t.error.captcha.unknown);
  }

  console.log(domain, form.data);

  // fail if email has already been registered

  // mutate database here
  // - add user if not already
  // - add user to event notification mail list

  return { form };
}
