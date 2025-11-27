CREATE TABLE `faq_search_analytics` (
	`id` int AUTO_INCREMENT NOT NULL,
	`query` varchar(255) NOT NULL,
	`resultsCount` int NOT NULL,
	`timestamp` timestamp NOT NULL DEFAULT (now()),
	`userAgent` text,
	`ipAddress` varchar(45),
	CONSTRAINT `faq_search_analytics_id` PRIMARY KEY(`id`)
);
