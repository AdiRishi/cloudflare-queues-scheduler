CREATE TABLE `event` (
	`id` text PRIMARY KEY NOT NULL,
	`data_key` text NOT NULL,
	`data_location` text NOT NULL,
	`queue_slug` text NOT NULL,
	`date_added_utc` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`date_scheduled_utc` integer NOT NULL,
	`status` text DEFAULT 'SCHEDULED' NOT NULL
);
--> statement-breakpoint
CREATE INDEX `event_data_key_idx` ON `event` (`data_key`);--> statement-breakpoint
CREATE INDEX `event_date_scheduled_utc_status_idx` ON `event` (`date_scheduled_utc`,`status`);