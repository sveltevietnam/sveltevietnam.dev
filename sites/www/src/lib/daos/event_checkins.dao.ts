import type { D1Database } from '@cloudflare/workers-types';

const TABLE_NAME = 'event_checkins';

export type EventCheckin = {
	event: string;
	email: string;
	method: 'qr' | 'form';
	created_by: 'self' | 'admin';
	created_at: string;
};

export function getCheckin(d1: D1Database, email: string, event: string) {
	return d1
		.prepare(`SELECT * FROM ${TABLE_NAME} WHERE email = ?1 AND event = ?2`)
		.bind(email, event)
		.first<EventCheckin>();
}

export function createCheckin(d1: D1Database, checkin: EventCheckin) {
	const { event, email, method, created_by, created_at } = checkin;
	return d1
		.prepare(
			`INSERT INTO ${TABLE_NAME} (event, email, method, created_by, created_at) VALUES (?1,?2,?3,?4, ?5)`,
		)
		.bind(event, email, method, created_by, created_at)
		.run();
}
