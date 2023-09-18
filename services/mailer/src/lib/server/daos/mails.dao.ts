import type { D1Database } from '@cloudflare/workers-types';

const TABLE_NAME = 'mails';

export type Mail = {
  id: number;
  email: string;
  html: string;
  created_at: string;
};

export function getMailById(d1: D1Database, id: string) {
  return d1.prepare(`SELECT * FROM ${TABLE_NAME} WHERE id = ?`).bind(id).first<Mail>();
}

export function createMail(d1: D1Database, email: string, html: string) {
  return d1
    .prepare(`INSERT INTO ${TABLE_NAME} (email,html,created_at) VALUES(?1,?2,?3)`)
    .bind(email, html, new Date().toISOString())
    .run();
}
