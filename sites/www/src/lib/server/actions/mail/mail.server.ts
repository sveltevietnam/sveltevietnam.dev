import { error, fail } from '@sveltejs/kit';
import type { RequestEvent } from '@sveltejs/kit';
import { message, setError, superValidate } from 'sveltekit-superforms/server';
import { z } from 'zod';

import type { MailMessage } from '$client/components/MailRegistrationForm';
import { validateToken } from '$server/services/turnstile';

import { translations } from './translation';

export type Mail = {
  email: string; // primary key
  name: string;
  job: boolean;
  event: boolean;
};

export async function mail<E extends RequestEvent>(event: E, domain: 'job' | 'event') {
  const { request, locals, platform } = event;

  // create i18n-aware validation schema
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

  // parse form object
  const form = await superValidate<typeof schema, MailMessage>(request, schema);
  if (!form.valid) {
    return fail(400, { form });
  }

  // check cloudflare turnstile captcha
  const turnstile = await validateToken(form.data.turnstile);
  if (!turnstile.success) {
    setError(form, 'turnstile', turnstile.error?.[0] ?? t.error.captcha.unknown);
    return fail(400, { form });
  }

  // get cloudflare bindings for d1 database
  const d1 = platform?.env?.D1;
  if (!d1) {
    // add error capturing
    throw error(500, t.error.dbNotAvailable);
  }

  try {
    // fail if email has already been registered for this domain
    const mail = await d1
      .prepare('SELECT * FROM mail WHERE email = ?')
      .bind(form.data.email)
      .first<Mail>();
    if (mail?.[domain]) {
      return message(form, {
        type: 'success',
        text: t.alreadyRegister,
      });
    }
    // mutate database
    await d1
      .prepare(
        `INSERT INTO mail(email,name,${domain}) VALUES(?1,?2,1) ON CONFLICT(email) DO UPDATE SET ${domain}=1`,
      )
      .bind(form.data.email, form.data.name)
      .run();

    return message(form, {
      type: 'success',
      text: t.success,
    });
  } catch (e) {
    // TODO: add error capturing
    console.error('Mail error', e);
    throw error(500, t.error.unknown);
  }
}
