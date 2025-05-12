import { createId } from '@paralleldrive/cuid2';
import { sql } from 'drizzle-orm';
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const subscribers = sqliteTable('subscribers', {
	id: text('id')
		.notNull()
		.primaryKey()
		.$default(() => createId()),
	name: text('name').notNull(),
	email: text('email').unique().notNull(),
	/** as a bit mask, see './domains.ts' */
	domains: integer('domains').notNull(),

	// timestamps
	createdAt: integer('created_at', { mode: 'timestamp_ms' })
		.notNull()
		.default(sql`(unixepoch() * 1000)`),
	updatedAt: integer('updated_at', { mode: 'timestamp_ms' }),
});
