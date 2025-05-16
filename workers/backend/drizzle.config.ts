import path from 'node:path';

import { defineConfig } from 'drizzle-kit';
import pico from 'picocolors';
import glob from 'tiny-glob/sync';

import wrangler from './wrangler.json';

const { CLOUDFLARE_ENV: mode = 'development', CLOUDFLARE_TOKEN: token } = process.env;

if (mode !== 'development' && !token) {
	throw new Error(pico.red('CLOUDFLARE_TOKEN is required in non-development mode.'));
}

const relativeDirpath = '.wrangler/state/v3/d1/miniflare-D1DatabaseObject';
const dirpath = path.join(__dirname, relativeDirpath);
const files = glob(path.join(dirpath, '*.sqlite'));
if (files.length === 0) {
	throw new Error(
		pico.red(`No SQLite file found at ${pico.yellow(relativeDirpath)}. Maybe run dev once?`),
	);
} else if (files.length > 1) {
	console.warn(pico.yellow(`Found multiple SQLite files at ${relativeDirpath}.`));
}

export default defineConfig({
	schema: './src/database/schema.ts',
	out: wrangler.env.production.d1_databases[0].migrations_dir,
	dialect: 'sqlite',
	...(mode === 'development'
		? {
				dbCredentials: {
					url: files[0],
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
