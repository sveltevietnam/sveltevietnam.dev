import { WorkerEntrypoint } from 'cloudflare:workers';
import { Hono } from 'hono';

import { BlueskyPostService } from './data/bluesky-posts';
import { EmployerService } from './data/employers';
import { JobPostingService } from './data/job-postings';
import { MailService } from './data/mails';
import { SubscriberService } from './data/subscribers';
import { getOrm } from './database/orm';
import { JwtService } from './jwt';

export default class extends WorkerEntrypoint<Env> {
	#orm: ReturnType<typeof getOrm>;
	#subscribers: SubscriberService | null = null;
	#mails: MailService | null = null;
	#blueskyPosts: BlueskyPostService | null = null;
	#employers: EmployerService | null = null;
	#jobPostings: JobPostingService | null = null;
	#jwt: JwtService | null = null;

	constructor(ctx: ExecutionContext, env: Env) {
		super(ctx, env);
		this.#orm = getOrm(env.d1);
	}

	get healthy() {
		return true;
	}

	jwt() {
		return (this.#jwt ??= new JwtService(this.env));
	}

	mails() {
		return (this.#mails ??= new MailService(this.#orm, this.env, this.jwt()));
	}

	subscribers() {
		return (this.#subscribers ??= new SubscriberService(
			this.#orm,
			this.env,
			this.jwt(),
			this.mails(),
		));
	}

	blueskyPosts() {
		return (this.#blueskyPosts ??= new BlueskyPostService(this.#orm));
	}

	employers() {
		return (this.#employers ??= new EmployerService(this.#orm));
	}

	jobPostings() {
		return (this.#jobPostings ??= new JobPostingService(
			this.#orm,
			this.env,
			this.ctx,
			this.jwt(),
			this.mails(),
		));
	}

	override fetch(request: Request): Response | Promise<Response> {
		return (
			new Hono<{ Bindings: Env }>()
				.get('/health', (c) => c.text('ok'))
				// quick approve job posting, only meant for internal use
				.get(':lang/qap/:token', async (c) => {
					const { lang, token } = c.req.param();
					const result = await this.jwt().verify<{ posting?: string; sub?: 'admin' }>(token);
					if (!result.success) {
						return c.text(result.error, 400);
					} else if (result.payload.sub !== 'admin') {
						return c.text('Unauthorized', 401);
					} else if (!result.payload.posting) {
						return c.text('No posting specified', 404);
					}
					const rLang = lang === 'vi' ? 'vi' : 'en';
					await this.jobPostings().approveById(result.payload.posting, rLang);
					return c.text('Approved');
				})
				.fetch(request, this.env, this.ctx)
		);
	}

	override async queue(batch: MessageBatch<Queue.Message>): Promise<void> {
		await Promise.all(
			batch.messages.map(async (message) => {
				switch (message.body.type) {
					case 'send-mail':
						try {
							await this.mails().send(message.body.templateId, message.body.input);
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
