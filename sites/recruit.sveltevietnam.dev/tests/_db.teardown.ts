import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { test as teardown } from '@playwright/test';
import { deleteLocalD1 } from '@sveltevietnam/backend/db/dev';
import wrangler from '@sveltevietnam/backend/wrangler.json' with { type: 'json' };
import pico from 'picocolors';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const backendDir = path.resolve(__dirname, '../../../workers/backend');

teardown('tear down database', async () => {
	console.log(pico.cyan('[E2E] Tearing down database...'));
	const databaseId = wrangler.env.test.d1_databases[0].database_id;
	deleteLocalD1(databaseId, backendDir);
});
