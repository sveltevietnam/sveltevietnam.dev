import { RpcTarget } from 'cloudflare:workers';
import { eq } from 'drizzle-orm';
import * as v from 'valibot';

import { MailService } from '$/data/mails';
import { ORM } from '$/database/orm';

import { mergeMasks } from './channels';
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
	#mails: MailService;

	constructor(orm: ORM, mailService: MailService) {
		super();
		this.#orm = orm;
		this.#mails = mailService;
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
			columns: { id: true, channels: true },
		});

		// insert
		if (!subscriber) {
			const [{ id }] = await this.#orm
				.insert(subscribers)
				.values(parsed.output)
				.returning({ id: subscribers.id });

			await this.#mails.queue({
				lang: input.language,
				subscriberId: id,
				templateId: 'welcome',
				vars: {
					name: input.name,
				},
			});

			return { success: true, id };
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

		return { success: true, id: subscriber.id };
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
}
