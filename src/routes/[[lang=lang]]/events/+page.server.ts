import { fail } from '@sveltejs/kit';
import { z } from 'zod';

import { COOKIE_USER_ID } from '$env/static/private';
import { createMockedEvents } from '$shared/mocks';
import type { Language } from '$shared/services/i18n';
import { translations } from '$shared/services/i18n/translations/pages/events';

import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
  const lang = params.lang as Language;
  return {
    translations: {
      page: translations[lang],
    },
    events: {
      upcoming: createMockedEvents(1),
      past: createMockedEvents(4),
    },
  };
};

export const actions: Actions = {
  notify: async ({ request, cookies, locals }) => {
    const data = await request.formData();
    const t = translations[locals.language].actions.participate.form.validation;

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

    // fail if email has already been registered

    // detect if email was in the system, get the userId, replace the cookie

    // mutate database here
    // - add user if not already
    // - add user to event notification mail list

    return { success: true, message: t.success, data: parsed.data };
  },
};
