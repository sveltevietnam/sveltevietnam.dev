import type { D1Database } from '@cloudflare/workers-types';

const TABLE_NAME = 'clients';

export function getSecretFromClientId(d1: D1Database, clientId: string) {
  return d1.prepare(`SELECT secret FROM ${TABLE_NAME} WHERE id = ?`).bind(clientId).first<string>();
}
