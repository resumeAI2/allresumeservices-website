CREATE TABLE `resume_samples` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`industry` varchar(100) NOT NULL,
	`beforeImage` varchar(500) NOT NULL,
	`afterImage` varchar(500) NOT NULL,
	`description` text,
	`improvements` text,
	`sortOrder` int DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `resume_samples_id` PRIMARY KEY(`id`)
);
