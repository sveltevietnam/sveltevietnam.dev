import { RpcTarget } from 'cloudflare:workers';
import { eq } from 'drizzle-orm';
import * as v from 'valibot';

import { ORM } from '$/database/orm';

import { mergeMasks } from './domains';
import {
	SubscriberInsertSchema,
	type SubscriberInsertInput,
	type SubscriberInsertResult,
	SubscriberUpdateSchema,
	type SubscriberUpdateInput,
	type SubscriberUpdateResult,
	SubscriberSelectSchema,
	type SubscriberSelectResult,
} from './schema';
import { subscribers } from './table';

export class SubscriberService extends RpcTarget {
	#orm: ORM;

	constructor(orm: ORM) {
		super();
		this.#orm = orm;
	}

	async getById(id: string): Promise<SubscriberSelectResult | null> {
		const result = await this.#orm
			.select()
			.from(subscribers)
			.where(eq(subscribers.id, id))
			.execute();

		if (result.length === 0) {
			return null;
		}

		return v.parse(SubscriberSelectSchema, result[0]);
	}

	async upsert(input: SubscriberInsertInput): Promise<SubscriberInsertResult> {
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
			columns: { id: true, domains: true },
		});

		// insert
		if (!subscriber) {
			const [{ id }] = await this.#orm
				.insert(subscribers)
				.values(parsed.output)
				.returning({ id: subscribers.id });

			// TODO: queue send-mail

			return { success: true, id };
		}

		// update
		await this.#orm
			.update(subscribers)
			.set({
				domains: mergeMasks(subscriber.domains, parsed.output.domains),
				name: parsed.output.name,
				updatedAt: new Date(),
			})
			.where(eq(subscribers.id, subscriber.id));

		return { success: true, id: subscriber.id };
	}

	async createSubscription(input: SubscriberInsertInput): Promise<SubscriberInsertResult> {
		// validate
		const parsed = v.safeParse(SubscriberInsertSchema, input);
		if (!parsed.success) {
			return {
				success: false,
				errors: v.flatten(parsed.issues),
			};
		}

		// persist data
		const [{ id }] = await this.#orm
			.insert(subscribers)
			.values(parsed.output)
			.returning({ id: subscribers.id });

		// TODO: queue send-mail

		return { success: true, id };
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
}
