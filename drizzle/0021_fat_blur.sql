CREATE TABLE `draft_intake_records` (
	`id` int AUTO_INCREMENT NOT NULL,
	`paypalTransactionId` varchar(255),
	`email` varchar(320),
	`resumeToken` varchar(64),
	`formData` text NOT NULL,
	`completed` int NOT NULL DEFAULT 0,
	`reminderSent` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `draft_intake_records_id` PRIMARY KEY(`id`),
	CONSTRAINT `draft_intake_records_resumeToken_unique` UNIQUE(`resumeToken`)
);
