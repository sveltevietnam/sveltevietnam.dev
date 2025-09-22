import fs from 'node:fs/promises';

import { test } from '@playwright/test';
import {
	getLocalORM,
	getLocalKVBlobPath,
	deleteLocalD1,
	pushSchema,
} from '@sveltevietnam/backend/db/dev';
import * as schema from '@sveltevietnam/backend/db/schema';

import { getBackendConfig } from '../utils';

interface TestWithBackendFixtures {
	d1: Awaited<ReturnType<typeof getLocalORM<typeof schema>>>;
	kvMails: {
		getById(mailId: string): Promise<string | null>;
	};
}

export const testWithBackend = test.extend<TestWithBackendFixtures>({
	// eslint-disable-next-line no-empty-pattern
	d1: async ({}, use) => {
		const { d1, cwd } = getBackendConfig();

		// ensure a clean database
		deleteLocalD1(d1.id, cwd);
		await pushSchema(d1.id, d1.schema, cwd);

		const orm = await getLocalORM(d1.id, d1.schema, cwd);
		await use(orm);

		// cleanup
		orm.$client.close();
		deleteLocalD1(d1.id, cwd);
	},
	// eslint-disable-next-line no-empty-pattern
	kvMails: async ({}, use) => {
		const { kvMails, cwd } = getBackendConfig();
		await use({
			getById: async (mailId: string) => {
				const mailHtmlPath = getLocalKVBlobPath(kvMails.id, mailId, cwd);
				if (!mailHtmlPath) return null;
				return fs.readFile(mailHtmlPath, 'utf-8');
			},
		});
	},
});
