-- Migration number: 0002 	 2023-09-18T06:35:01.203Z
CREATE TABLE IF NOT EXISTS mails
(
  id TEXT NOT NULL PRIMARY KEY,
  email TEXT NOT NULL,
  language TEXT NOT NULL,
  template_id TEXT NOT NULL,
  html TEXT NOT NULL,
  created_at TEXT NOT NULL
);
