const TABLE_NAME = 'event_tickets';

/**
 * @typedef {{
 * 	event: string;
 * 	email: string;
 * 	name: string;
 * 	num: number;
 * 	created_at: string;
 * 	updated_at?: string;
 * }} EventTicket
 */

/**
 *
 * @param {import('@cloudflare/workers-types').D1Database} d1
 * @param {string} email
 * @param {string} event
 * @returns {Promise<EventTicket | null>}
 */
export function getTicket(d1, email, event) {
	return d1
		.prepare(`SELECT * FROM ${TABLE_NAME} WHERE email = ?1 AND event = ?2`)
		.bind(email, event)
		.first();
}

/**
 *
 * @param {import('@cloudflare/workers-types').D1Database} d1
 * @param {Omit<EventTicket, 'num'>} ticket
 * @returns {Promise<import('@cloudflare/workers-types').D1Response>}
 */
export function createTicket(d1, ticket) {
	const { event, email, name, created_at } = ticket;
	return d1
		.prepare(
			`INSERT INTO ${TABLE_NAME} (event, email, name, created_at, num) SELECT ?1, ?2, ?3, ?4, COUNT(*) + 1 FROM ${TABLE_NAME} WHERE event = ?1`,
		)
		.bind(event, email, name, created_at)
		.run();
}
