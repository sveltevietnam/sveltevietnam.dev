/**
 * @file development and testing utilities. Expect Node environment only!
 */

import crypto from 'node:crypto';
import fs from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import sqlite from 'node:sqlite';

export const WRANGLER_LOCAL_D1_DIRPATH = '.wrangler/state/v3/d1/miniflare-D1DatabaseObject';

/**
 * Credit: https://github.com/cloudflare/workers-sdk/issues/4548#issuecomment-1934930563
 * @param {string} name
 * @param {string} uniqueKey
 * @returns {string}
 */
export function durableObjectNamespaceIdFromName(name, uniqueKey) {
	const key = crypto.createHash('sha256').update(uniqueKey).digest();
	const nameHmac = crypto.createHmac('sha256', key).update(name).digest().subarray(0, 16);
	const hmac = crypto.createHmac('sha256', key).update(nameHmac).digest().subarray(0, 16);
	return Buffer.concat([nameHmac, hmac]).toString('hex');
}

/**
 * @typedef GetLocalD1PathOptions
 * @property {string} [cwd] - current working directory, default to `process.cwd()`
 * @property {boolean} [vacuum] - create a vacuum Sqlite database if not exist, default to `true`
 */

/**
 * @typedef GetLocalD1PathResult
 * @property {string} path - absolute path to the local D1 database file
 * @property {boolean} created - whether the database file was created (i.e. did not exist before)
 */

/**
 * @param {string} databaseId
 * @param {GetLocalD1PathOptions} [options]
 * @returns {GetLocalD1PathResult}
 */
export function getLocalD1Path(databaseId, options = {}) {
	const { cwd = process.cwd(), vacuum = true } = options;
	const filepath = path.join(
		cwd,
		WRANGLER_LOCAL_D1_DIRPATH,
		`${durableObjectNamespaceIdFromName(databaseId, 'miniflare-D1DatabaseObject')}.sqlite`,
	);

	const created = vacuum && !fs.existsSync(filepath);
	if (created) {
		fs.mkdirSync(path.dirname(filepath), { recursive: true });
		const db = new sqlite.DatabaseSync(filepath);
		db.exec(`VACUUM;`);
		db.close();
	}

	return { path: filepath, created };
}

/**
 * @template {Record<string, unknown>} TSchema
 * @param {string} databaseId
 * @param {TSchema} schema
 * @returns {Promise<import('drizzle-orm/libsql').LibSQLDatabase<TSchema> & { $client: import('@libsql/client').Client }>}
 */
export async function getLocalORM(databaseId, schema) {
	// 1. get local D1 path, create a vacuum database if not exist
	const { path } = getLocalD1Path(databaseId);

	// 2. create an explicit LibSQL client
	const { createClient } = await import('@libsql/client');
	const client = createClient({ url: `file:${path}` });

	// 3. create a Drizzle instance
	const { drizzle } = await import('drizzle-orm/libsql');
	const orm = drizzle(client, { schema, casing: 'snake_case' });
	orm.$client.close();

	return orm;
}

/**
 * https://github.com/drizzle-team/drizzle-orm/discussions/4373#discussioncomment-12743792
 * @param {string} databaseId
 * @param {Record<string, import('drizzle-orm/sqlite-core').SQLiteTable | import('drizzle-orm').Relations>} schema
 * @returns {Promise<void>}
 */
export async function pushSchema(databaseId, schema) {
	const orm = await getLocalORM(databaseId, schema);

	// push schema
	const require = createRequire(import.meta.url);
	const { generateSQLiteDrizzleJson, generateSQLiteMigration } = require('drizzle-kit/api');
	const prevJson = await generateSQLiteDrizzleJson({});
	const curJson = await generateSQLiteDrizzleJson(schema, prevJson.id, 'snake_case');
	const statements = await generateSQLiteMigration(prevJson, curJson);
	for (const statement of statements) {
		await orm.run(statement);
	}

	// cleanup
	orm.$client.close();
}

/**
 * @param {string} databaseId
 */
export function deleteLocalD1(databaseId) {
	const { path } = getLocalD1Path(databaseId, { vacuum: false });
	if (fs.existsSync(path)) {
		fs.rmSync(path);
	}
}
