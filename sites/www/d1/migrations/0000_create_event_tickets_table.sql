-- Migration number: 0000 	 2024-02-19T08:18:05.267Z
CREATE TABLE IF NOT EXISTS event_tickets
(
	event TEXT NOT NULL,
	email TEXT NOT NULL,
	name TEXT NOT NULL,
	num integer NOT NULL,
	created_at TEXT NOT NULL,
	updated_at TEXT,

	PRIMARY KEY (email, event)
);
