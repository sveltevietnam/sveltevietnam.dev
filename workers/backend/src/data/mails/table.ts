import { createId } from '@paralleldrive/cuid2';
import { relations, sql } from 'drizzle-orm';
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

import { subscribers } from '$/data/subscribers/table';
import { ids } from '$/mjml/templates/ids';

export const mails = sqliteTable('mails', {
	id: text('id')
		.notNull()
		.primaryKey()
		.$default(() => createId()),
	templateId: text('template_id', {
		enum: ids,
	}).notNull(),
	subject: text('subject').notNull(),
	email: text('email').notNull(),
	subscriberId: text('subscriber_id').notNull(),

	// timestamps
	sentAt: integer('created_at', { mode: 'timestamp_ms' })
		.notNull()
		.default(sql`(unixepoch() * 1000)`),
	lastViewOnWebAt: integer('last_view_on_web_at', { mode: 'timestamp_ms' }),
});

export const mail_relations = relations(mails, ({ one }) => ({
	subscriber: one(subscribers, {
		fields: [mails.subscriberId],
		references: [subscribers.id],
	}),
}));
