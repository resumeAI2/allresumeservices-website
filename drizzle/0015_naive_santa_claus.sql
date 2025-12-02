CREATE TABLE `case_studies` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`slug` varchar(255) NOT NULL,
	`category` varchar(100) NOT NULL,
	`clientName` varchar(255) NOT NULL,
	`challenge` text NOT NULL,
	`solution` text NOT NULL,
	`result` text NOT NULL,
	`testimonialQuote` text,
	`image` varchar(500),
	`published` int NOT NULL DEFAULT 0,
	`featured` int NOT NULL DEFAULT 0,
	`viewCount` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `case_studies_id` PRIMARY KEY(`id`),
	CONSTRAINT `case_studies_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `social_media_posts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`blogPostId` int,
	`caseStudyId` int,
	`platform` varchar(50) NOT NULL,
	`postText` text NOT NULL,
	`postUrl` varchar(500),
	`status` enum('pending','posted','failed') NOT NULL DEFAULT 'pending',
	`scheduledFor` timestamp,
	`postedAt` timestamp,
	`errorMessage` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `social_media_posts_id` PRIMARY KEY(`id`)
);
