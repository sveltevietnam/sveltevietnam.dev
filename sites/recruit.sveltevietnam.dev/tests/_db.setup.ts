import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { test as setup } from '@playwright/test';
import { pushSchema, deleteLocalD1 } from '@sveltevietnam/backend/db/dev';

import { getBackendConfig } from './utils';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const backendDir = path.resolve(__dirname, '../../../workers/backend');

setup('bootstrap database', async () => {
	const { d1, cwd } = getBackendConfig();
	deleteLocalD1(d1.id, cwd);
	await pushSchema(d1.id, d1.schema, backendDir);
});
