-- Migration number: 0000 	 2023-09-16T10:28:23.224Z
CREATE TABLE IF NOT EXISTS subscriptions
(
  email       TEXT NOT NULL PRIMARY KEY,
  name        TEXT NOT NULL DEFAULT "",
  job         INTEGER NOT NULL DEFAULT 0,
  event       INTEGER NOT NULL DEFAULT 0,
  created_at  TEXT NOT NULL DEFAULT 0,
  updated_at  TEXT
);
