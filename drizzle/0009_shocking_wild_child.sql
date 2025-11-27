CREATE TABLE `testimonials` (
	`id` int AUTO_INCREMENT NOT NULL,
	`clientName` varchar(255) NOT NULL,
	`clientTitle` varchar(255),
	`clientPhoto` varchar(500),
	`rating` int NOT NULL,
	`testimonialText` text NOT NULL,
	`serviceUsed` varchar(100),
	`featured` int NOT NULL DEFAULT 0,
	`approved` int NOT NULL DEFAULT 1,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `testimonials_id` PRIMARY KEY(`id`)
);
