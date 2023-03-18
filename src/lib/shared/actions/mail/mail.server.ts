import { fail } from '@sveltejs/kit';
import type { RequestEvent } from '@sveltejs/kit';
import { z } from 'zod';

import { COOKIE_USER_ID } from '$env/static/private';

import { translations } from './translation';

export async function mail<E extends RequestEvent>(event: E, domain: 'job' | 'event') {
  const { request, locals, cookies } = event;
  const data = await request.formData();
  const t = translations[locals.language].validation;

  const schema = z.object({
    userId: z.string().uuid(),
    name: z.string().min(1, { message: t.error.name.required }),
    email: z
      .string()
      .min(1, { message: t.error.email.required })
      .email({ message: t.error.email.invalid }),
  });

  const parsed = schema.safeParse({
    userId: cookies.get(COOKIE_USER_ID) ?? crypto.randomUUID(),
    name: data.get('name'),
    email: data.get('email'),
  });

  if (!parsed.success) {
    const error = parsed.error.flatten();
    return fail(400, {
      success: false,
      error: {
        form: error.fieldErrors,
      },
    });
  }

  console.log(domain);

  // fail if email has already been registered

  // mutate database here
  // - add user if not already
  // - add user to event notification mail list

  return { success: true, message: t.success, data: parsed.data };
}
