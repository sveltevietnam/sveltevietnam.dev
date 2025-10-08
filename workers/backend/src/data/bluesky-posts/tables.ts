import { sql } from 'drizzle-orm';
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const blueskyPosts = sqliteTable('bluesky_posts', {
	postId: text('post_id').notNull().primaryKey(),
	blueskyAccountId: text('bluesky_account_id').notNull(),
	blueskyPostId: text('bluesky_post_id').notNull(),

	// timestamps
	createdAt: integer('created_at', { mode: 'timestamp_ms' })
		.notNull()
		.default(sql`(unixepoch() * 1000)`),
	updatedAt: integer('updated_at', { mode: 'timestamp_ms' }),
});
