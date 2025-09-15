import { createId } from '@paralleldrive/cuid2';
import { relations, sql } from 'drizzle-orm';
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

import { employers } from '$/data/employers/tables';

import { JOB_POSTING_TYPES, JOB_POSTING_APPLICATION_METHODS } from './enums';

export const jobPostings = sqliteTable('job_postings', {
	// keys
	id: text('id')
		.notNull()
		.primaryKey()
		.$default(() => 'job_' + createId()),
	employerId: text('employer_id').notNull(),

	// descriptive fields
	title: text('title').notNull(),
	type: text('type', { enum: JOB_POSTING_TYPES }).notNull(),
	location: text('location').notNull(),
	salary: text('salary').notNull(),
	applicationMethod: text('application_method', {
		enum: JOB_POSTING_APPLICATION_METHODS,
	}).notNull(),
	applicationLink: text('application_link').notNull(),
	description: text('description').notNull(),

	// timestamps
	expiredAt: integer('expired_at', { mode: 'timestamp_ms' }).notNull(),
	createdAt: integer('created_at', { mode: 'timestamp_ms' })
		.notNull()
		.default(sql`(unixepoch() * 1000)`),
	updatedAt: integer('updated_at', { mode: 'timestamp_ms' }),
	deletedAt: integer('deleted_at', { mode: 'timestamp_ms' }),
});

export const jobPostingRelations = relations(jobPostings, ({ one }) => ({
	employer: one(employers, {
		fields: [jobPostings.employerId],
		references: [employers.id],
	}),
}));
