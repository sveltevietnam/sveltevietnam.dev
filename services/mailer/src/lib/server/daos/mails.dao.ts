import type { D1Database } from '@cloudflare/workers-types';

const TABLE_NAME = 'mails';

export type Mail = {
  id: string;
  email: string;
  html: string;
  created_at: string;
};

export function getMailById(d1: D1Database, id: string) {
  return d1.prepare(`SELECT * FROM ${TABLE_NAME} WHERE id = ?`).bind(id).first<Mail>();
}

export function createMail(d1: D1Database, { id, email, html, created_at }: Mail) {
  return d1
    .prepare(`INSERT INTO ${TABLE_NAME} (id,email,html,created_at) VALUES(?1,?2,?3,?4)`)
    .bind(id, email, html, created_at)
    .run();
}
