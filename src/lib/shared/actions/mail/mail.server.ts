import { fail, type ActionFailure } from '@sveltejs/kit';
import type { RequestEvent } from '@sveltejs/kit';
import { z } from 'zod';

import { COOKIE_USER_ID } from '$env/static/private';
import { validateToken } from '$server/services/turnstile';
import { CLOUDFLARE_TURNSTILE_FORM_FIELD } from '$shared/constants';

import { translations } from './translation';

type MailActionResponse =
  | ActionFailure<{
      success: false;
      error: {
        form?: {
          name?: string[];
          email?: string[];
        };
        turnstile?: string[];
      };
    }>
  | {
      success: true;
      message: string;
      data: {
        name: string;
        email: string;
        turnstile: string;
      };
    };

export async function mail<E extends RequestEvent>(
  event: E,
  domain: 'job' | 'event',
): Promise<MailActionResponse> {
  const { request, locals, cookies } = event;
  const data = await request.formData();
  const t = translations[locals.language].validation;

  const schema = z.object({
    userId: z.string().uuid(),
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

  const parsed = schema.safeParse({
    userId: cookies.get(COOKIE_USER_ID) ?? crypto.randomUUID(),
    name: data.get('name'),
    email: data.get('email'),
    turnstile: data.get(CLOUDFLARE_TURNSTILE_FORM_FIELD),
  });

  if (!parsed.success) {
    const error = parsed.error.flatten();
    return fail(400, {
      success: false,
      error: {
        form: error.fieldErrors,
        turnstile: error.fieldErrors.turnstile,
      },
    });
  }

  const turnstile = await validateToken(parsed.data.turnstile);
  if (!turnstile.success) {
    return fail(400, {
      success: false,
      error: {
        turnstile: turnstile.error,
      },
    });
  }
  console.log(domain, parsed);

  // fail if email has already been registered

  // mutate database here
  // - add user if not already
  // - add user to event notification mail list

  return { success: true, message: t.success, data: parsed.data };
}
