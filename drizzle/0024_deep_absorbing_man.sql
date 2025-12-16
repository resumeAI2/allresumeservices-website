ALTER TABLE `client_intake_records` MODIFY COLUMN `cityState` varchar(255);--> statement-breakpoint
ALTER TABLE `client_intake_records` MODIFY COLUMN `employmentStatus` enum('employed_full_time','employed_part_time','casual','contractor','unemployed','student','other');--> statement-breakpoint
ALTER TABLE `client_intake_records` MODIFY COLUMN `targetRoles` text;--> statement-breakpoint
ALTER TABLE `client_intake_records` ADD `linkedinUrl` varchar(500);--> statement-breakpoint
ALTER TABLE `client_intake_records` ADD `languageSkills` text;--> statement-breakpoint
ALTER TABLE `client_intake_records` ADD `shortCoursesTraining` text;--> statement-breakpoint
ALTER TABLE `client_intake_records` ADD `professionalMemberships` text;--> statement-breakpoint
ALTER TABLE `client_intake_records` ADD `volunteerWork` text;--> statement-breakpoint
ALTER TABLE `client_intake_records` ADD `awardsRecognition` text;--> statement-breakpoint
ALTER TABLE `client_intake_records` ADD `publications` text;--> statement-breakpoint
ALTER TABLE `client_intake_records` ADD `referees` text;