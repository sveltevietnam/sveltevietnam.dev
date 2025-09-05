PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_mails` (
	`id` text PRIMARY KEY NOT NULL,
	`template_id` text NOT NULL,
	`from` text NOT NULL,
	`subject` text NOT NULL,
	`to` text NOT NULL,
	`actor_id` text,
	`created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`last_view_on_web_at` integer
);
--> statement-breakpoint
INSERT INTO `__new_mails`("id", "template_id", "from", "subject", "to", "actor_id", "created_at", "last_view_on_web_at") SELECT "id", "template_id", "from", "subject", "to", "actor_id", "created_at", "last_view_on_web_at" FROM `mails`;--> statement-breakpoint
DROP TABLE `mails`;--> statement-breakpoint
ALTER TABLE `__new_mails` RENAME TO `mails`;--> statement-breakpoint
PRAGMA foreign_keys=ON;