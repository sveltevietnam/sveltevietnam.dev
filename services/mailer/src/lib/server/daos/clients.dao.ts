import type { D1Database } from '@cloudflare/workers-types';

const TABLE_NAME = 'clients';

export async function getSecretFromClientId(d1: D1Database, clientId: string) {
  const result = await d1
    .prepare(`SELECT secret FROM ${TABLE_NAME} WHERE id = ?`)
    .bind(clientId)
    .first<{ secret: string }>();
  return result?.secret;
}
