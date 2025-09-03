import { createId } from '@paralleldrive/cuid2';
import { sql } from 'drizzle-orm';
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

import { ids } from '$/mjml/templates/ids';

export const mails = sqliteTable('mails', {
	id: text('id')
		.notNull()
		.primaryKey()
		.$default(() => 'mail_' + createId()),
	templateId: text('template_id', {
		enum: ids,
	}).notNull(),
	from: text('from').notNull(),
	subject: text('subject').notNull(),
	to: text('to').notNull(),
	// the user that triggered the email
	actorId: text('actor_id').notNull(),

	// timestamps
	sentAt: integer('created_at', { mode: 'timestamp_ms' })
		.notNull()
		.default(sql`(unixepoch() * 1000)`),
	lastViewOnWebAt: integer('last_view_on_web_at', { mode: 'timestamp_ms' }),
});
