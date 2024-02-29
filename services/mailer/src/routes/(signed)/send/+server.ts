import { SendRequestSchema, type SendResponseDTO } from '@internals/isc/mailer';
import { json } from '@sveltejs/kit';
import jwt from '@tsndr/cloudflare-worker-jwt';
import Mustache from 'mustache';

import {
	DKIM_DOMAIN,
	DKIM_PRIVATE_KEY,
	DKIM_SELECTOR,
	JWT_SECRET,
	WWW_URL,
} from '$env/static/private';
import { PUBLIC_MODE } from '$env/static/public';
import { createMail, type Mail } from '$server/daos/mails.dao';
import { throwMailerSvelteKitError } from '$server/errors';
import { EMAIL_TEMPLATES } from '$server/mjml/templates';

import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, locals, url }) => {
	const parsed = SendRequestSchema.safeParse(await request.json());
	if (!parsed.success) {
		throwMailerSvelteKitError('SEND_INVALID_INPUT', parsed.error.errors[0]?.message);
	}

	const { templateId, variables = {}, to, language } = parsed.data;

	// check for template
	const template = EMAIL_TEMPLATES[templateId]?.[language];
	if (!template) {
		throwMailerSvelteKitError('SEND_TEMPLATE_NOT_FOUND');
	}

	// construct mail URL
	const id = crypto.randomUUID();
	const token = encodeURIComponent(
		await jwt.sign(
			{
				id,
				email: to.email,
				sub: to.email,
				iat: Math.floor(new Date().getTime() / 1000),
				iss: 'mailer.sveltevietnam.dev',
			},
			JWT_SECRET,
		),
	);

	const mailerURL = url.origin;
	const mailURL = `${mailerURL}/mails/${token}`;
	console.log(`Turbo ~ constPOST:RequestHandler= ~ mailURL:`, mailURL);
	// render
	const html = Mustache.render(template.html, {
		mailerURL,
		wwwURL: WWW_URL,
		mailURL,
		subscriptionURL: `${WWW_URL}/${language}/${
			language === 'en' ? 'subscriptions' : 'dang-ky'
		}/${token}`,
		...variables,
	});

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
			console.error('MAILCHANNELS ERROR', resp);
			throwMailerSvelteKitError('SEND_MAILCHANNELS_ERROR', await resp.text());
		}
	}

	// save mail record
	const mail = {
		id,
		email: to.email,
		language,
		template_id: templateId,
		html,
		created_at: new Date().toISOString(),
	} satisfies Mail;
	await createMail(locals.d1, mail);

	return json({ success: true } satisfies SendResponseDTO, { status: 201 });
};
