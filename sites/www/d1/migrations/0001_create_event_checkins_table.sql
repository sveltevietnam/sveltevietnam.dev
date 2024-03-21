-- Migration number: 0001 	 2024-03-19T23:46:17.667Z
CREATE TABLE IF NOT EXISTS event_checkins
(
	event TEXT NOT NULL,
	email TEXT NOT NULL,
	method TEXT NOT NULL,
	created_by TEXT NOT NULL,
	created_at TEXT NOT NULL,

	PRIMARY KEY (email, event)
);
