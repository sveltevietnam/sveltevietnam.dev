/**
 * @file development and testing utilities. Expect Node environment only!
 */

import crypto from 'node:crypto';
import fs from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import sqlite from 'node:sqlite';

export const WRANGLER_LOCAL_D1_DIRPATH = '.wrangler/state/v3/d1/miniflare-D1DatabaseObject';
export const WRANGLER_LOCAL_R2_DIRPATH = '.wrangler/state/v3/kv/miniflare-KVNamespaceObject';

type StorageClass = 'D1Database' | 'R2Bucket' | 'KVNamespace' | 'Cache';
/**
 * Credit: https://github.com/cloudflare/workers-sdk/issues/4548#issuecomment-1934930563
 * @param {string} name
 * @param {StorageClass} storageClass
 * @returns {string}
 */
export function getObjectStorageId(name: string, storageClass: StorageClass): string {
	const uniqueKey = `miniflare-${storageClass}Object`;
	const key = crypto.createHash('sha256').update(uniqueKey).digest();
	const nameHmac = crypto.createHmac('sha256', key).update(name).digest().subarray(0, 16);
	const hmac = crypto.createHmac('sha256', key).update(nameHmac).digest().subarray(0, 16);
	return Buffer.concat([nameHmac, hmac]).toString('hex');
}

interface GetLocalD1PathOptions {
	/** current working directory, default to `process.cwd()` */
	cwd?: string;
	/** create a vacuum Sqlite database if not exist, default to `true` */
	vacuum?: boolean;
}

interface GetLocalD1PathResult {
	/** absolute path to the local D1 database file */
	path: string;
	/** whether the database file was created (i.e. did not exist before) */
	created: boolean;
}

/**
 * @param {string} databaseId
 * @param {GetLocalD1PathOptions} [options]
 * @returns {GetLocalD1PathResult}
 */
export function getLocalD1Path(
	databaseId: string,
	options: GetLocalD1PathOptions = {},
): GetLocalD1PathResult {
	const { cwd = process.cwd(), vacuum = true } = options;
	const filepath = path.join(
		cwd,
		WRANGLER_LOCAL_D1_DIRPATH,
		`${getObjectStorageId(databaseId, 'D1Database')}.sqlite`,
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
 * @param {string} kvId
 * @param {string} [cwd]
 * @returns {string}
 */
export function getLocalKVStoragePath(kvId: string, cwd = process.cwd()): string {
	return path.join(
		cwd,
		WRANGLER_LOCAL_R2_DIRPATH,
		`${getObjectStorageId(kvId, 'KVNamespace')}.sqlite`,
	);
}

/**
 * @param {string} kvId
 * @param {string} itemKey
 * @param {string} [cwd]
 * @returns {string | null}
 */
export function getLocalKVBlobPath(
	kvId: string,
	itemKey: string,
	cwd = process.cwd(),
): string | null {
	const storagePath = getLocalKVStoragePath(kvId, cwd);
	const db = new sqlite.DatabaseSync(storagePath);

	const query = db.prepare(`SELECT * FROM _mf_entries WHERE key = ?`);
	const [blob] = query.all(itemKey);
	if (!blob?.blob_id) {
		db.close();
		return null;
	}

	// can be improved here? as currently i don't know how to get the middle dirname
	const globPattern = path.join(
		cwd,
		path.dirname(WRANGLER_LOCAL_R2_DIRPATH),
		'**',
		blob.blob_id.toString(),
	);
	const files = fs.globSync(globPattern);
	if (!files.length) {
		db.close();
		return null;
	}

	db.close();
	return files[0];
}

/**
 * @template {Record<string, unknown>} TSchema
 * @param {string} databaseId
 * @param {TSchema} schema
 * @param {string} [cwd]
 * @returns {Promise<import('drizzle-orm/libsql').LibSQLDatabase<TSchema> & { $client: import('@libsql/client').Client }>}
 */
export async function getLocalORM<TSchema extends Record<string, unknown>>(
	databaseId: string,
	schema: TSchema,
	cwd?: string,
): Promise<
	import('drizzle-orm/libsql').LibSQLDatabase<TSchema> & {
		$client: import('@libsql/client').Client;
	}
> {
	// 1. get local D1 path, create a vacuum database if not exist
	const { path } = getLocalD1Path(databaseId, { vacuum: true, cwd });

	// 2. create an explicit LibSQL client
	const { createClient } = await import('@libsql/client');
	const client = createClient({ url: `file:${path}` });

	// 3. create a Drizzle instance
	const { drizzle } = await import('drizzle-orm/libsql');
	const orm = drizzle(client, { schema, casing: 'snake_case' });

	return orm;
}

/**
 * https://github.com/drizzle-team/drizzle-orm/discussions/4373#discussioncomment-12743792
 * @template {Record<string, unknown>} TSchema
 * @param {string} databaseId
 * @param {TSchema} schema
 * @param {string} [cwd]
 * @returns {Promise<void>}
 */
export async function pushSchema<TSchema extends Record<string, unknown>>(
	databaseId: string,
	schema: TSchema,
	cwd?: string,
): Promise<void> {
	const orm = await getLocalORM(databaseId, schema, cwd);
	if (orm.$client.closed) {
		orm.$client.reconnect();
	}

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
 * @param {string} [cwd]
 * @return {void}
 */
export function deleteLocalD1(databaseId: string, cwd?: string): void {
	const { path } = getLocalD1Path(databaseId, { vacuum: false, cwd });
	if (fs.existsSync(path)) {
		fs.rmSync(path);
	}
}
