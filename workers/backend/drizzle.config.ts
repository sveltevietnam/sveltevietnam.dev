import { defineConfig } from 'drizzle-kit';
import pico from 'picocolors';

import { getLocalD1Path } from './src/database/dev';
import wrangler from './wrangler.json';

const { CLOUDFLARE_ENV, CLOUDFLARE_TOKEN: token } = process.env;

// parse mode
type Mode = 'development' | 'test' | 'production';
const mode = (CLOUDFLARE_ENV ?? 'development') as Mode;

if (mode !== 'development' && !token) {
	throw new Error(pico.red('CLOUDFLARE_TOKEN is required in non-development mode.'));
}

const databaseId = wrangler.env[mode as Mode].d1_databases[0].database_id;
const { path: sqliteFilepath, created } = getLocalD1Path(databaseId);
if (created) {
	console.warn(
		pico.yellow(
			`Expect "${pico.underline(sqliteFilepath)}" but not found. Will attempt to create one. If this doesn't work, consider checking drizzle.config for the sqlite3 filename hashing algorithm (potentially outdated).`,
		),
	);
}

export default defineConfig({
	schema: './src/database/schema.ts',
	out: wrangler.env.production.d1_databases[0].migrations_dir,
	dialect: 'sqlite',
	...(mode !== 'production'
		? {
				dbCredentials: {
					url: sqliteFilepath,
				},
			}
		: {
				driver: 'd1-http',
				dbCredentials: {
					accountId: wrangler.account_id,
					databaseId: wrangler.env.production.d1_databases[0].database_id,
					token,
				},
			}),
	verbose: true,
	strict: true,
});
