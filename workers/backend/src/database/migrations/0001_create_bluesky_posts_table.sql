CREATE TABLE `bluesky_posts` (
	`post_id` text PRIMARY KEY NOT NULL,
	`bluesky_account_id` text NOT NULL,
	`bluesky_post_id` text NOT NULL,
	`created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`updated_at` integer
);
