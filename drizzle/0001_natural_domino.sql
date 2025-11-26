CREATE TABLE `orders` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int,
	`packageName` varchar(100) NOT NULL,
	`amount` varchar(20) NOT NULL,
	`currency` varchar(3) NOT NULL DEFAULT 'AUD',
	`paypalOrderId` varchar(255),
	`paypalPayerId` varchar(255),
	`status` enum('pending','completed','cancelled','failed') NOT NULL DEFAULT 'pending',
	`customerName` varchar(255),
	`customerEmail` varchar(320),
	`customerPhone` varchar(50),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `orders_id` PRIMARY KEY(`id`)
);
