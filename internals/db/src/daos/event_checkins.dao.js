const TABLE_NAME = 'event_checkins';

/**
 * @typedef {{
 * 	event: string;
 * 	email: string;
 * 	method: 'token' | 'qr' | 'form';
 * 	created_by: 'anonymous' | 'self' | 'admin';
 * 	created_at: string;
 * }} EventCheckin
 */

/**
 * @param {import('@cloudflare/workers-types').D1Database} d1
 * @param {string} email
 * @param {string} event
 * @returns {Promise<EventCheckin | null>}
 */
export function getCheckin(d1, email, event) {
	return d1
		.prepare(`SELECT * FROM ${TABLE_NAME} WHERE email = ?1 AND event = ?2`)
		.bind(email, event)
		.first();
}

/**
 * @param {import('@cloudflare/workers-types').D1Database} d1
 * @param {EventCheckin} checkin
 * @returns {Promise<import('@cloudflare/workers-types').D1Response>}
 */
export function createCheckin(d1, checkin) {
	const { event, email, method, created_by, created_at } = checkin;
	return d1
		.prepare(
			`INSERT INTO ${TABLE_NAME} (event, email, method, created_by, created_at) VALUES (?1,?2,?3,?4, ?5)`,
		)
		.bind(event, email, method, created_by, created_at)
		.run();
}
