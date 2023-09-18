import { createMailerErrorResponse, sendSchema, type SendResponseDTO } from '@internals/isc/mailer';
import { json } from '@sveltejs/kit';
import Mustache from 'mustache';

import { DKIM_DOMAIN, DKIM_PRIVATE_KEY, DKIM_SELECTOR } from '$env/static/private';
import { PUBLIC_MODE } from '$env/static/public';
import { createMail } from '$server/daos/mails.dao';
import { EMAIL_TEMPLATES } from '$server/templates';

import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, locals }) => {
  const parsed = sendSchema.safeParse(await request.json());
  if (!parsed.success) {
    return createMailerErrorResponse(
      'SEND_INVALID_INPUT',
      parsed.error.errors.map((e) => e.message),
    );
  }

  try {
    const { templateId, variables = {}, to } = parsed.data;

    // render html from template
    const template = EMAIL_TEMPLATES[templateId];
    if (!template) {
      return createMailerErrorResponse('SEND_TEMPLATE_NOT_FOUND');
    }
    const html = Mustache.render(template.html, variables);

    // send with mailchannels (only in production)
    if (PUBLIC_MODE === 'production') {
      const body = {
        personalizations: [
          {
            to: [to],
            dkim_domain: DKIM_DOMAIN,
            dkim_selector: DKIM_SELECTOR,
            dkim_private_key: DKIM_PRIVATE_KEY,
          },
        ],
        from: template.from,
        subject: template.subject,
        content: [
          {
            type: 'text/html',
            value: html,
          },
        ],
      };
      const resp = await fetch('https://api.mailchannels.net/tx/v1/send', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!resp.ok) {
        // TODO: add error capturing
        console.error(await resp.text());
        return createMailerErrorResponse('SEND_UNKNOWN_ERROR');
      }
    }

    // save mail record
    await createMail(locals.d1, to.email, html);

    return json({ success: true } satisfies SendResponseDTO, { status: 201 });
  } catch (e) {
    // TODO: add error capturing
    console.error(e);
    return createMailerErrorResponse('SEND_UNKNOWN_ERROR');
  }
};
