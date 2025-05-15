import jwt from '@tsndr/cloudflare-worker-jwt';
import { WorkerEntrypoint } from 'cloudflare:workers';
import { Hono } from 'hono';

import { getOrm } from '$/database/orm';

import { MailService } from './data/mails';
import { SubscriberService } from './data/subscribers';
import {
	type JwtPayload,
	type JwtVerificationResult,
	TOKEN_VERIFICATION_ERRORS,
} from './utils/jwt';

export default class extends WorkerEntrypoint<Env> {
	#subscribers: SubscriberService;
	#mails: MailService;

	constructor(ctx: ExecutionContext, env: Env) {
		super(ctx, env);
		const orm = getOrm(env.d1);
		this.#mails = new MailService(orm, env);
		this.#subscribers = new SubscriberService(orm, this.#mails);
	}

	subscribers() {
		return this.#subscribers;
	}

	mails() {
		return this.#mails;
	}

	async verify(token: string): Promise<JwtVerificationResult> {
		const secret =
			import.meta.env.MODE !== 'development' ? await this.env.jwt_secret.get() : 'secret';
		try {
			const verifiedToken = await jwt.verify<JwtPayload>(token, secret, { throwError: true });
			if (!verifiedToken || !verifiedToken.payload)
				return {
					success: false,
					error: 'UNKNOWN',
				};
			return {
				success: true,
				payload: verifiedToken.payload,
			};
		} catch (e) {
			if (TOKEN_VERIFICATION_ERRORS.includes((e as Error).message)) {
				return {
					success: false,
					error: (e as Error).message,
				};
			}
			throw e;
		}
	}

	override fetch(request: Request): Response | Promise<Response> {
		return new Hono<{ Bindings: Env }>()
			.get('/health', (c) => c.text('ok'))
			.fetch(request, this.env, this.ctx);
	}

	override async queue(batch: MessageBatch<Queue.Message>): Promise<void> {
		await Promise.all(
			batch.messages.map(async (message) => {
				switch (message.body.type) {
					case 'send-mail':
						try {
							await this.#mails.send(message.body.input);
							message.ack();
						} catch (e) {
							// TODO: log error
							console.error('Error sending mail', e);
							message.retry({
								delaySeconds: 5,
							});
						}
						break;
					default:
						// ignore unknown message
						message.ack();
				}
			}),
		);
	}
}
