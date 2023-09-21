import type { D1Database } from '@cloudflare/workers-types';
import type { Language } from '@internals/isc/common';

const TABLE_NAME = 'mails';

export type Mail = {
  id: string;
  email: string;
  language: Language;
  template_id: string;
  html: string;
  created_at: string;
};

export function getMailById(d1: D1Database, id: string) {
  return d1.prepare(`SELECT * FROM ${TABLE_NAME} WHERE id = ?`).bind(id).first<Mail>();
}

export function createMail(
  d1: D1Database,
  { id, email, language, template_id, html, created_at }: Mail,
) {
  return d1
    .prepare(
      `INSERT INTO ${TABLE_NAME} (id,email,language,template_id,html,created_at) VALUES(?1,?2,?3,?4,?5,?6)`,
    )
    .bind(id, email, language, template_id, html, created_at)
    .run();
}
