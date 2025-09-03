import { createId } from '@paralleldrive/cuid2';
import { LANGUAGES } from '@sveltevietnam/i18n/language';
import { sql } from 'drizzle-orm';
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const subscribers = sqliteTable('subscribers', {
	id: text('id')
		.notNull()
		.primaryKey()
		.$default(() => `subscriber_` + createId()),
	name: text('name').notNull(),
	email: text('email').unique().notNull(),
	/** as a bit mask, see './channels.ts' */
	channels: integer('channels').notNull(),
	/** language of the page when user subscribes */
	language: text('language', {
		enum: LANGUAGES,
	}).notNull(),

	// timestamps
	createdAt: integer('created_at', { mode: 'timestamp_ms' })
		.notNull()
		.default(sql`(unixepoch() * 1000)`),
	updatedAt: integer('updated_at', { mode: 'timestamp_ms' }),
	verifiedAt: integer('verified_at', { mode: 'timestamp_ms' }),
});
