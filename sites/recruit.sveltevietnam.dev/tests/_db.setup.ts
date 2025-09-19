import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { test as setup } from '@playwright/test';
import { pushSchema, deleteLocalD1 } from '@sveltevietnam/backend/db/dev';
import pico from 'picocolors';

import { getBackendConfig } from './utils';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const backendDir = path.resolve(__dirname, '../../../workers/backend');

setup('bootstrap database', async () => {
	console.log(pico.cyan('[E2E] Bootstrapping database...'));
	const { database, cwd } = getBackendConfig();
	deleteLocalD1(database.id, cwd);
	await pushSchema(database.id, database.schema, backendDir);
});
