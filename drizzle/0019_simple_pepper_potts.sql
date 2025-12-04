CREATE TABLE `lead_magnet_subscribers` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`email` varchar(320) NOT NULL,
	`downloadedTemplate` varchar(255) NOT NULL,
	`sourcePost` varchar(500),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `lead_magnet_subscribers_id` PRIMARY KEY(`id`)
);
