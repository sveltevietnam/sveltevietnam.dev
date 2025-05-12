import path from 'node:path';

import { defineConfig } from 'drizzle-kit';
import pico from 'picocolors';
import glob from 'tiny-glob/sync';

import wrangler from './wrangler.json';

const mode = process.env.VITE_MODE ?? 'development';

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
	out: './src/database/migrations',
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
					databaseId: wrangler.d1_databases[0].database_id,
					token: process.env.CLOUDFLARE_TOKEN!,
				},
			}),
	verbose: true,
	strict: true,
});
