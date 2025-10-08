CREATE TABLE `employer_auth_verifications` (
	`id` text PRIMARY KEY NOT NULL,
	`identifier` text NOT NULL,
	`value` text NOT NULL,
	`created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`updated_at` integer,
	`expires_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `employer_sessions` (
	`id` text PRIMARY KEY NOT NULL,
	`employer_id` text NOT NULL,
	`token` text NOT NULL,
	`expires_at` integer NOT NULL,
	`user_agent` text,
	`ip_address` text,
	`created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`updated_at` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `employer_sessions_token_unique` ON `employer_sessions` (`token`);--> statement-breakpoint
CREATE TABLE `employers` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`email_verified` integer DEFAULT false NOT NULL,
	`image` text,
	`website` text,
	`description` text DEFAULT '' NOT NULL,
	`agreed` integer DEFAULT false NOT NULL,
	`created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`updated_at` integer,
	`onboarded_at` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `employers_email_unique` ON `employers` (`email`);--> statement-breakpoint
CREATE TABLE `job_postings` (
	`id` text PRIMARY KEY NOT NULL,
	`employer_id` text NOT NULL,
	`title` text NOT NULL,
	`type` text NOT NULL,
	`location` text NOT NULL,
	`salary` text NOT NULL,
	`application_method` text NOT NULL,
	`application_link` text NOT NULL,
	`description` text NOT NULL,
	`approved_at` integer,
	`expired_at` integer NOT NULL,
	`created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`updated_at` integer,
	`deleted_at` integer
);
