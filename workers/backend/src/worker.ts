import { WorkerEntrypoint } from 'cloudflare:workers';
import { Hono } from 'hono';

import { getOrm } from '$/database/orm';

import { SubscriberService } from './data/subscribers';

export default class extends WorkerEntrypoint<Env> {
	#subscribers: SubscriberService;

	constructor(ctx: ExecutionContext, env: Env) {
		super(ctx, env);
		const orm = getOrm(env.d1);
		this.#subscribers = new SubscriberService(orm);
	}

	subscribers() {
		return this.#subscribers;
	}

	override fetch(request: Request): Response | Promise<Response> {
		return new Hono<{ Bindings: Env }>()
			.get('/health', (c) => c.text('ok'))
			.get('/', async (c) => {
				const subscriber = await this.#subscribers.getById('1');
				if (!subscriber) return c.notFound();
				return c.json(subscriber);
			})
			.fetch(request, this.env, this.ctx);
	}

	override async queue(batch: MessageBatch<Queue.Message>): Promise<void> {
		await Promise.all(
			batch.messages.map((message) => {
				switch (message.body.type) {
					case 'send-mail':
						// handle this stuff
						break;
					default:
						// ignore unknown message
						message.ack();
				}
			}),
		);
	}
}
