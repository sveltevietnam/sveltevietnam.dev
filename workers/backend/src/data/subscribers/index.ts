import { RpcTarget } from 'cloudflare:workers';
import { eq } from 'drizzle-orm';
import * as v from 'valibot';

import { MailService } from '../../data/mails';
import { ORM } from '../../database/orm';
import { type JwtService } from '../../jwt';

import { mergeMasks } from './channels';
import {
	SubscriberInsertSchema,
	type SubscriberUpsertInput,
	type SubscriberUpsertResult,
	SubscriberUpdateSchema,
	type SubscriberUpdateInput,
	type SubscriberUpdateResult,
	SubscriberSelectSchema,
	type SubscriberSelectResult,
} from './schema';
import { subscribers } from './tables';

export class SubscriberService extends RpcTarget {
	#env: Env;
	#orm: ORM;
	#jwt: JwtService;
	#mails: MailService;

	constructor(orm: ORM, env: Env, jwtService: JwtService, mailService: MailService) {
		super();
		this.#orm = orm;
		this.#env = env;
		this.#jwt = jwtService;
		this.#mails = mailService;
	}

	async getById(id: string): Promise<SubscriberSelectResult | null> {
		const subscriber = await this.#orm.query.subscribers.findFirst({
			where: (table, { eq }) => eq(table.id, id),
		});
		return subscriber ? v.parse(SubscriberSelectSchema, subscriber) : null;
	}

	async upsert(input: SubscriberUpsertInput): Promise<SubscriberUpsertResult> {
		// validate
		const parsed = v.safeParse(SubscriberInsertSchema, input);
		if (!parsed.success) {
			return {
				success: false,
				errors: v.flatten(parsed.issues),
			};
		}

		const subscriber = await this.#orm.query.subscribers.findFirst({
			where: (subscriber, { eq }) => eq(subscriber.email, parsed.output.email),
			columns: { id: true, channels: true },
		});

		// insert
		if (!subscriber) {
			const [{ id }] = await this.#orm
				.insert(subscribers)
				.values(parsed.output)
				.returning({ id: subscribers.id });

			const date = new Date();
			const token = await this.#jwt.sign({
				sub: id,
				iat: Math.floor(date.getTime() / 1000),
			});
			const eVerifyUrl = new URL(
				`/${input.language}/everify/${token}`,
				this.#env.SITE_URL,
			).toString();

			await this.#mails.queue('welcome', {
				lang: input.language,
				actorId: id,
				vars: {
					eVerifyUrl,
					name: input.name,
				},
			});

			return { success: true, id, action: 'insert' };
		}

		// update
		await this.#orm
			.update(subscribers)
			.set({
				channels: mergeMasks(subscriber.channels, parsed.output.channels),
				name: parsed.output.name,
				updatedAt: new Date(),
				language: parsed.output.language,
			})
			.where(eq(subscribers.id, subscriber.id));

		return { success: true, id: subscriber.id, action: 'update' };
	}

	async update(input: SubscriberUpdateInput): Promise<SubscriberUpdateResult> {
		// validate
		const parsed = v.safeParse(SubscriberUpdateSchema, input);
		if (!parsed.success) {
			return {
				success: false,
				errors: v.flatten(parsed.issues),
			};
		}

		// TODO: notify if email changes

		// persist data
		const { id, ...rest } = parsed.output;
		await this.#orm
			.update(subscribers)
			.set({
				updatedAt: new Date(),
				...rest,
			})
			.where(eq(subscribers.id, id))
			.returning({ id: subscribers.id });

		return { success: true };
	}

	async verify(id: string): Promise<{ success: true }> {
		await this.#orm
			.update(subscribers)
			.set({
				updatedAt: new Date(),
				verifiedAt: new Date(),
			})
			.where(eq(subscribers.id, id));

		return { success: true };
	}
}
