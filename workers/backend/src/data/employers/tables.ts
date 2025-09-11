import { createId } from '@paralleldrive/cuid2';
import { relations, sql } from 'drizzle-orm';
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

/**
 * @see https://www.better-auth.com/docs/concepts/database#user
 */
export const employers = sqliteTable('employers', {
	id: text('id')
		.notNull()
		.primaryKey()
		.$default(() => 'employer_' + createId()),
	name: text('name').notNull(),
	email: text('email').unique().notNull(),
	emailVerified: integer('email_verified', { mode: 'boolean' }).notNull().default(false),
	/** expects R2 resource url */
	image: text('image'),

	/** additional fields (outside better auth's core schema) */
	website: text('website'),
	description: text('description').notNull().default(''),
	agreed: integer('agreed', { mode: 'boolean' }).notNull().default(false),

	// timestamps
	createdAt: integer('created_at', { mode: 'timestamp_ms' })
		.notNull()
		.default(sql`(unixepoch() * 1000)`),
	updatedAt: integer('updated_at', { mode: 'timestamp_ms' }),
	onboardedAt: integer('onboarded_at', { mode: 'timestamp_ms' }),
});
export const employerRelations = relations(employers, ({ many }) => ({
	sessions: many(employerSessions),
	// accounts: many(employerAccounts),
}));

/**
 * @see https://www.better-auth.com/docs/concepts/database#session
 */
export const employerSessions = sqliteTable('employer_sessions', {
	id: text('id')
		.notNull()
		.primaryKey()
		.$default(() => createId()),
	employerId: text('employer_id').notNull(),

	// token info
	token: text('token').notNull().unique(),
	expiresAt: integer('expires_at', { mode: 'timestamp_ms' }).notNull(),

	// additional info
	userAgent: text('user_agent'),
	ip: text('ip_address'),

	// generic timestamps
	createdAt: integer('created_at', { mode: 'timestamp_ms' })
		.notNull()
		.default(sql`(unixepoch() * 1000)`),
	updatedAt: integer('updated_at', { mode: 'timestamp_ms' }),
});
export const employerSessionRelations = relations(employerSessions, ({ one }) => ({
	employer: one(employers, {
		fields: [employerSessions.employerId],
		references: [employers.id],
	}),
}));

// /**
//  * @see https://www.better-auth.com/docs/concepts/database#account
//  */
// export const employerAccounts = sqliteTable('employer_accounts', {
// 	id: text('id')
// 		.notNull()
// 		.primaryKey()
// 		.$default(() => createId()),
// 	userId: text('employer_id').notNull(),
//
// 	// for password-based auth
// 	password: text('password'),
//
// 	// specific to auth providers (SSO)
// 	accountId: text('account_id').notNull(),
// 	providerId: text('provider_id').notNull(),
// 	accessToken: text('access_token'),
// 	accessTokenExpiresAt: integer('access_token_expires_at', { mode: 'timestamp_ms' }),
// 	refreshToken: text('refresh_token'),
// 	refreshTokenExpiresAt: integer('refresh_token_expires_at', { mode: 'timestamp_ms' }),
// 	scope: text('scope'),
// 	idToken: text('id_token'),
//
// 	// generic timestamps
// 	createdAt: integer('created_at', { mode: 'timestamp_ms' })
// 		.notNull()
// 		.default(sql`(unixepoch() * 1000)`),
// 	updatedAt: integer('updated_at', { mode: 'timestamp_ms' }),
// });
// export const employerAccountRelations = relations(employerAccounts, ({ one }) => ({
// 	employer: one(employers, {
// 		fields: [employerAccounts.userId],
// 		references: [employers.id],
// 	}),
// }));

/**
 * @see https://www.better-auth.com/docs/concepts/database#verification
 */
export const employerAuthVerifications = sqliteTable('employer_auth_verifications', {
	id: text('id')
		.notNull()
		.primaryKey()
		.$default(() => createId()),
	identifier: text('identifier').notNull(),
	value: text('value').notNull(),

	// timestamps
	createdAt: integer('created_at', { mode: 'timestamp_ms' })
		.notNull()
		.default(sql`(unixepoch() * 1000)`),
	updatedAt: integer('updated_at', { mode: 'timestamp_ms' }),
	expiresAt: integer('expires_at', { mode: 'timestamp_ms' }).notNull(),
});

