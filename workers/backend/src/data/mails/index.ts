import type { SendEmailCommandInput } from '@aws-sdk/client-sesv2';
import { createId } from '@paralleldrive/cuid2';
import { Language } from '@sveltevietnam/i18n';
import jwt from '@tsndr/cloudflare-worker-jwt';
import { AwsClient } from 'aws4fetch';
import { RpcTarget } from 'cloudflare:workers';
import { eq } from 'drizzle-orm';
import Mustache from 'mustache';

import { ORM } from '$/database/orm';
import { TemplateVarMap, type TemplateId, loadTemplate, BaseTemplateVars } from '$/mjml/templates';

import { createSocials, createLogoImageUrl } from '../links';

import { mails } from './table';

/**
 * expiration time for html and JWT,
 * in seconds (7 days)
 */
const TTL = 60 * 60 * 24 * 7;

export type WebMail = {
	id: string;
	subject: string;
	from: string;
	to: string;
	html: string;
	sentAt: Date;
};

export type SendMailInput<T extends TemplateId> = {
	actorId: string;
	templateId: T;
	lang: Language;
	vars: TemplateVarMap[T];
};

export class MailService extends RpcTarget {
	#orm: ORM;
	#env: Env;

	constructor(orm: ORM, env: Env) {
		super();
		this.#orm = orm;
		this.#env = env;
	}

	async getWebMail(id: string): Promise<WebMail | null> {
		const html = await this.#env.kv_mails.get(id, { type: 'text' });
		if (!html) return null; // expired or not found
		const mail = await this.#orm.query.mails.findFirst({
			where: eq(mails.id, id),
			columns: {
				id: true,
				from: true,
				to: true,
				subject: true,
				sentAt: true,
				lastViewOnWebAt: true,
			},
		});
		if (!mail) return null; // not found
		await this.#orm.update(mails).set({ lastViewOnWebAt: new Date() }).where(eq(mails.id, id));
		return {
			...mail,
			html,
		};
	}

	async queue<T extends TemplateId>(input: SendMailInput<T>): Promise<void> {
		return this.#env.queue.send(
			{
				type: 'send-mail',
				input: input,
			},
			{
				delaySeconds: 0,
				contentType: 'json',
			},
		);
	}

	async send<T extends TemplateId>(input: SendMailInput<T>): Promise<string> {
		const { templateId, actorId, lang, vars } = input;

		// get template
		const template = await loadTemplate(templateId, lang);
		if (!template) {
			throw new Error(`Template ${templateId} not found`);
		}

		// get subscriber
		let to: string | null = null;
		if (actorId.startsWith('subscriber_')) {
			const subscriber = await this.#orm.query.subscribers.findFirst({
				where: (subscriber, { eq }) => eq(subscriber.id, actorId),
				columns: { email: true, name: true },
			});
			if (!subscriber) {
				throw new Error(`Subscriber ${actorId} not found`);
			}
			to = subscriber.email;
		}

		if (!to) {
			throw new Error(`Cannot determine recipient email for actor ${actorId}`);
		}

		// create mail record
		const mailId = `mail_` + createId();
		const { SITE_URL: siteUrl, MODE: mode, AWS_REGION: awsRegion } = this.#env;
		// Workaround for this https://github.com/cloudflare/workers-sdk/issues/9006
		const secret = mode !== 'development' ? await this.#env.secret_jwt.get() : 'secret';
		const date = new Date();
		const token = await jwt.sign(
			{
				sub: actorId,
				iat: Math.floor(date.getTime() / 1000),
				iss: 'backend.sveltevietnam.dev',
				exp: Math.floor(date.getTime() / 1000) + TTL,
			},
			secret,
		);
		const socials = createSocials(siteUrl);
		const html = Mustache.render(template.html, {
			subject: template.subject,
			logoUrl: createLogoImageUrl(siteUrl),
			siteUrl: `${siteUrl}/${lang}`,
			mailUrl: `${siteUrl}/${lang}/mails/${mailId}?token=${token}`,
			discordUrl: socials.discord.href,
			socials,
			...vars,
		} satisfies TemplateVarMap[T] & BaseTemplateVars);

		if (mode === 'development') {
			// skip sending email in dev mode
			console.log('Mail web url:', `${siteUrl}/${lang}/mails/${mailId}?token=${token}`);
		} else {
			// send actual email with AWS SES
			const [accessKeyId, secretAccessKey] = await Promise.all([
				this.#env.secret_ses_access_key.get(),
				this.#env.secret_ses_access_secret.get(),
			]);
			const aws = new AwsClient({
				accessKeyId,
				secretAccessKey,
				region: awsRegion,
			});
			const response = await aws.fetch(
				`https://email.${awsRegion}.amazonaws.com/v2/email/outbound-emails`,
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						FromEmailAddress: `${template.from.name} <${template.from.email}>`,
						ReplyToAddresses: [template.from.email],
						FeedbackForwardingEmailAddress: template.from.email,
						Destination: {
							ToAddresses: [to],
						},
						Content: {
							Simple: {
								Body: {
									Html: {
										Charset: 'UTF-8',
										Data: html,
									},
								},
								Subject: {
									Charset: 'UTF-8',
									Data: template.subject,
								},
							},
						},
					} satisfies SendEmailCommandInput),
				},
			);
			if (!response.ok) {
				const result = (await response.json()) as { message?: string };
				let message = `Failed to send email - ${response.status}: ${response.statusText}`;
				if ('message' in result) {
					message += ` - ${result.message}`;
				}
				throw new Error(message, { cause: result });
			}
		}

		// save html to kv
		await this.#env.kv_mails.put(mailId, html, {
			expirationTtl: TTL,
		});

		await this.#orm.insert(mails).values({
			id: mailId,
			actorId,
			subject: template.subject,
			from: template.from.email,
			to,
			templateId,
			sentAt: date,
		});

		return mailId;
	}
}
