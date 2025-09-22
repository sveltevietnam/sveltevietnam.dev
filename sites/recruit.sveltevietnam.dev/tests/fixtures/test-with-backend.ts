import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { test } from '@playwright/test';
import {
	getLocalORM,
	getLocalKVBlobPath,
	deleteLocalD1,
	pushSchema,
} from '@sveltevietnam/backend/db/dev';
import * as schema from '@sveltevietnam/backend/db/schema';
import backendWranglerConfig from '@sveltevietnam/backend/wrangler.json' with { type: 'json' };

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export function getBackendConfig() {
	const cwd = path.resolve(__dirname, '../../../../workers/backend');
	return {
		cwd,
		d1: {
			id: backendWranglerConfig.env.test.d1_databases[0].database_id,
			schema,
		},
		kvMails: {
			id: backendWranglerConfig.env.test.kv_namespaces[0].id,
		},
	};
}

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
