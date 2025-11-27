ALTER TABLE `contact_submissions` ADD `notes` text;--> statement-breakpoint
ALTER TABLE `contact_submissions` ADD `updatedAt` timestamp DEFAULT (now()) NOT NULL ON UPDATE CURRENT_TIMESTAMP;