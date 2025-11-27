CREATE TABLE `uploaded_images` (
	`id` int AUTO_INCREMENT NOT NULL,
	`filename` varchar(255) NOT NULL,
	`url` text NOT NULL,
	`key` varchar(500) NOT NULL,
	`contentType` varchar(100) NOT NULL,
	`size` int,
	`uploadedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `uploaded_images_id` PRIMARY KEY(`id`)
);
