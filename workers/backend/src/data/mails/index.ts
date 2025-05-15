import { createId } from '@paralleldrive/cuid2';
import { Language } from '@sveltevietnam/i18n';
import jwt from '@tsndr/cloudflare-worker-jwt';
import { RpcTarget } from 'cloudflare:workers';
import { eq } from 'drizzle-orm';
import Mustache from 'mustache';

import logoUrl from '$/assets/images/logo.png';
import { ORM } from '$/database/orm';
import { TemplateVarMap, type TemplateId, loadTemplate, BaseTemplateVars } from '$/mjml/templates';

import { socials } from '../links';

import { mails } from './table';

/**
 * expiration time for html and JWT,
 * in seconds (7 days)
 */
const TTL = 60 * 60 * 24 * 7;

export type WebMail = {
	id: string;
	subject: string;
	email: string;
	html: string;
	sentAt: Date;
};

export type SendMailInput<T extends TemplateId> = {
	subscriberId: string;
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
			columns: { id: true, email: true, subject: true, sentAt: true, lastViewOnWebAt: true },
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
		const { templateId, subscriberId, lang, vars } = input;

		// get template
		const template = await loadTemplate(templateId, lang);
		if (!template) {
			throw new Error(`Template ${templateId} not found`);
		}

		// get subscriber
		const subscriber = await this.#orm.query.subscribers.findFirst({
			where: (subscriber, { eq }) => eq(subscriber.id, subscriberId),
			columns: { email: true, name: true },
		});
		if (!subscriber) {
			throw new Error(`Subscriber ${subscriberId} not found`);
		}

		// create mail record
		const mailId = createId();
		const { VITE_SITE_URL: siteUrl } = import.meta.env;
		// Workaround for this
		// https://github.com/cloudflare/workers-sdk/issues/9006
		const secret =
			import.meta.env.MODE !== 'development' ? await this.#env.jwt_secret.get() : 'secret';
		const date = new Date();
		const token = await jwt.sign(
			{
				sub: subscriberId,
				iat: Math.floor(date.getTime() / 1000),
				iss: 'backend.sveltevietnam.dev',
				exp: Math.floor(date.getTime() / 1000) + TTL,
			},
			secret,
		);
		const html = Mustache.render(template.html, {
			subject: template.subject,
			logoUrl,
			siteUrl: `${siteUrl}/${lang}`,
			mailUrl: `${siteUrl}/${lang}/mails/${mailId}?token=${token}`,
			discordUrl: socials.discord.href,
			socials,
			...vars,
		} satisfies TemplateVarMap[T] & BaseTemplateVars);

		// TODO: send actual mail
		console.log('Mail:', `${siteUrl}/${lang}/mails/${mailId}?token=${token}`);

		// save html to kv
		await this.#env.kv_mails.put(mailId, html, {
			expirationTtl: TTL,
		});

		await this.#orm.insert(mails).values({
			id: mailId,
			subscriberId,
			subject: template.subject,
			email: subscriber.email,
			templateId,
			sentAt: date,
		});

		return mailId;
	}
}
