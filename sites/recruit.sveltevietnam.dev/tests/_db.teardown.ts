import { test as teardown } from '@playwright/test';
import { deleteLocalD1 } from '@sveltevietnam/backend/db/dev';

import { getBackendConfig } from './utils';

teardown('tear down database', async () => {
	const { d1, cwd } = getBackendConfig();
	deleteLocalD1(d1.id, cwd);
});
