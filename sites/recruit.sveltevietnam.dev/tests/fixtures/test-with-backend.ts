import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { test, expect } from '@playwright/test';
import {
	getLocalORM,
	getLocalKVBlobPath,
	deleteLocalD1,
	pushSchema,
} from '@sveltevietnam/backend/db/dev';
import * as schema from '@sveltevietnam/backend/db/schema';
import { type Id as MailTemplateId } from '@sveltevietnam/backend/mails';
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

export interface TestWithBackendFixtures {
	d1: Awaited<ReturnType<typeof getLocalORM<typeof schema>>>;
	mails: {
		getLatest(email: string, templateId: MailTemplateId, actorId?: string): Promise<string>;
	};
}

export async function setup() {
	const { d1, cwd } = getBackendConfig();
	// ensure a clean database
	deleteLocalD1(d1.id, cwd);
	await pushSchema(d1.id, d1.schema, cwd);
}

export async function teardown() {
	const { d1, cwd } = getBackendConfig();
	deleteLocalD1(d1.id, cwd);
}

export const testWithBackend = test.extend<TestWithBackendFixtures>({
	// eslint-disable-next-line no-empty-pattern
	d1: async ({}, use) => {
		const { d1, cwd } = getBackendConfig();
		const orm = await getLocalORM(d1.id, d1.schema, cwd);
		await use(orm);
		orm.$client.close();
	},

	mails: async ({ d1 }, use) => {
		const { kvMails, cwd } = getBackendConfig();
		await use({
			getLatest: async (email, templateId, actorId) => {
				// 1. Get the latest mail record for the email
				const record = await d1.query.mails.findFirst({
					where: (table, { eq, and, isNull }) =>
						and(
							eq(table.to, email),
							eq(table.templateId, templateId),
							actorId ? eq(table.actorId, actorId) : isNull(table.actorId),
						),
					orderBy: (table, { desc }) => [desc(table.sentAt)],
				});
				expect(record).toBeTruthy();

				// 2. Get the mail HTML content from local KV
				const blobPath = getLocalKVBlobPath(kvMails.id, record!.id, cwd);
				expect(blobPath).toBeTruthy();
				const html = await fs.readFile(blobPath!, 'utf-8');
				expect(html).toBeTruthy();

				return html;
			},
		});
	},
});

export { schema };
