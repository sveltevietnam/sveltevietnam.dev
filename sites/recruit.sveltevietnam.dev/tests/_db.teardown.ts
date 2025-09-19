import { test as teardown } from '@playwright/test';
import { deleteLocalD1 } from '@sveltevietnam/backend/db/dev';
import pico from 'picocolors';

import { getBackendConfig } from './utils';

teardown('tear down database', async () => {
	console.log(pico.cyan('[E2E] Tearing down database...'));
	const { database, cwd } = getBackendConfig();
	deleteLocalD1(database.id, cwd);
});
