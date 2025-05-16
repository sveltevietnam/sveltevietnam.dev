CREATE TABLE `subscribers` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`channels` integer NOT NULL,
	`language` text NOT NULL,
	`created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`updated_at` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `subscribers_email_unique` ON `subscribers` (`email`);--> statement-breakpoint
CREATE TABLE `mails` (
	`id` text PRIMARY KEY NOT NULL,
	`template_id` text NOT NULL,
	`from` text NOT NULL,
	`subject` text NOT NULL,
	`to` text NOT NULL,
	`subscriber_id` text NOT NULL,
	`created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`last_view_on_web_at` integer
);
