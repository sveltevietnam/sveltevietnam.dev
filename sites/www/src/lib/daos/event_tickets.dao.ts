import type { D1Database } from '@cloudflare/workers-types';

const TABLE_NAME = 'event_tickets';

export type EventTicket = {
	event: string;
	email: string;
	name: string;
	num: number;
	created_at: string;
	updated_at?: string;
};

export function getTicket(d1: D1Database, email: string, event: string) {
	return d1
		.prepare(`SELECT * FROM ${TABLE_NAME} WHERE email = ?1 AND event = ?2`)
		.bind(email, event)
		.first<EventTicket>();
}

export function createTicket(d1: D1Database, ticket: Omit<Ticket, 'num'>) {
	const { event, email, name, created_at } = ticket;
	return d1
		.prepare(
			`INSERT INTO ${TABLE_NAME} (event, email, name, created_at, num) SELECT ?1, ?2, ?3, ?4, COUNT(*) + 1 FROM ${TABLE_NAME} WHERE event = ?1`,
		)
		.bind(event, email, name, created_at)
		.run();
}
