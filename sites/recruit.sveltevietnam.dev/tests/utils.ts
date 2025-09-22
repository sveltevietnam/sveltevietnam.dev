import path from 'node:path';
import { fileURLToPath } from 'node:url';

import * as schema from '@sveltevietnam/backend/db/schema';
import backendWranglerConfig from '@sveltevietnam/backend/wrangler.json' with { type: 'json' };

import recruitWranglerConfig from '../wrangler.json' with { type: 'json' };

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export function getBackendConfig() {
	const cwd = path.resolve(__dirname, '../../../workers/backend');
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

export function getWranglerVars() {
	return recruitWranglerConfig.env.test.vars;
}

export function generateTimestampedEmail(): string {
	const timestamp = Date.now();
	return `e2e+${timestamp}@example.com`;
}
