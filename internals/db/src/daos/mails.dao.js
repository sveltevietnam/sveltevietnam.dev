const TABLE_NAME = 'mails';

/**
 * @typedef {{
 *  id: string;
 * 	email: string;
 * language: import('@internals/utils/language').Language;
 * template_id: string;
 * html: string;
 * created_at: string;
 * }} Mail
 */

/**
 *
 * @param {import('@cloudflare/workers-types').D1Database} d1
 * @param {string} id
 * @returns {Promise<Mail | null>}
 */
export function getMailById(d1, id) {
	return d1.prepare(`SELECT * FROM ${TABLE_NAME} WHERE id = ?`).bind(id).first();
}

/**
 * @param {import('@cloudflare/workers-types').D1Database} d1
 * @param {Mail} id
 * @returns {Promise<import('@cloudflare/workers-types').D1Response>}
 */
export function createMail(d1, { id, email, language, template_id, html, created_at }) {
	return d1
		.prepare(
			`INSERT INTO ${TABLE_NAME} (id,email,language,template_id,html,created_at) VALUES(?1,?2,?3,?4,?5,?6)`,
		)
		.bind(id, email, language, template_id, html, created_at)
		.run();
}
