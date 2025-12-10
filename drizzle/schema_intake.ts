import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Client intake records table - stores comprehensive career information after payment
 */
export const client_intake_records = mysqlTable("client_intake_records", {
  id: int("id").autoincrement().primaryKey(),
  
  // Link to order and payment
  orderId: int("orderId"),
  paypalTransactionId: varchar("paypalTransactionId", { length: 255 }),
  purchasedService: varchar("purchasedService", { length: 255 }),
  
  // Section 1: Personal Details
  firstName: varchar("firstName", { length: 100 }).notNull(),
  lastName: varchar("lastName", { length: 100 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  phone: varchar("phone", { length: 50 }).notNull(),
  cityState: varchar("cityState", { length: 255 }).notNull(),
  bestContactTime: text("bestContactTime"),
  
  // Section 3: Current Situation
  employmentStatus: mysqlEnum("employmentStatus", [
    "employed_full_time",
    "employed_part_time", 
    "casual",
    "contractor",
    "unemployed",
    "student",
    "other"
  ]).notNull(),
  currentJobTitle: varchar("currentJobTitle", { length: 255 }),
  currentEmployer: varchar("currentEmployer", { length: 255 }),
  currentRoleOverview: text("currentRoleOverview"),
  
  // Section 4: Target Roles and Career Goals
  targetRoles: text("targetRoles").notNull(),
  preferredIndustries: text("preferredIndustries"),
  locationPreferences: text("locationPreferences"),
  workArrangements: text("workArrangements"), // JSON array: FIFO, DIDO, shift work, remote
  jobAdLink1: varchar("jobAdLink1", { length: 500 }),
  jobAdLink2: varchar("jobAdLink2", { length: 500 }),
  jobAdLink3: varchar("jobAdLink3", { length: 500 }),
  
  // Section 6: Education and Training
  highestQualification: varchar("highestQualification", { length: 255 }),
  institution: varchar("institution", { length: 255 }),
  yearCompleted: varchar("yearCompleted", { length: 10 }),
  additionalQualifications: text("additionalQualifications"),
  
  // Section 7: Licences, Tickets and Clearances
  driversLicence: varchar("driversLicence", { length: 100 }),
  highRiskLicences: text("highRiskLicences"),
  siteInductions: text("siteInductions"),
  securityClearances: text("securityClearances"),
  
  // Section 8: Skills and Strengths
  technicalSkills: text("technicalSkills"),
  interpersonalStrengths: text("interpersonalStrengths"),
  
  // Section 9: Additional Information
  employmentGaps: text("employmentGaps"),
  keyAchievements: text("keyAchievements"),
  preferredStyle: text("preferredStyle"),
  hearAboutUs: varchar("hearAboutUs", { length: 255 }),
  
  // File uploads
  resumeFileUrl: text("resumeFileUrl"),
  supportingDocsUrls: text("supportingDocsUrls"), // JSON array of URLs
  
  // Metadata
  status: mysqlEnum("status", ["pending", "in_progress", "completed"]).default("pending").notNull(),
  adminNotes: text("adminNotes"),
  submittedAt: timestamp("submittedAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ClientIntakeRecord = typeof client_intake_records.$inferSelect;
export type InsertClientIntakeRecord = typeof client_intake_records.$inferInsert;

/**
 * Employment history table - stores job entries for each intake record
 */
export const employment_history = mysqlTable("employment_history", {
  id: int("id").autoincrement().primaryKey(),
  intakeRecordId: int("intakeRecordId").notNull(),
  
  jobTitle: varchar("jobTitle", { length: 255 }).notNull(),
  employer: varchar("employer", { length: 255 }).notNull(),
  location: varchar("location", { length: 255 }),
  startDate: varchar("startDate", { length: 20 }).notNull(), // Format: "MM/YYYY"
  endDate: varchar("endDate", { length: 20 }).notNull(), // Format: "MM/YYYY" or "Current"
  employmentType: mysqlEnum("employmentType", ["full_time", "part_time", "casual", "contract"]).notNull(),
  keyResponsibilities: text("keyResponsibilities"),
  keyAchievements: text("keyAchievements"),
  
  sortOrder: int("sortOrder").default(0), // For maintaining order of jobs
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type EmploymentHistory = typeof employment_history.$inferSelect;
export type InsertEmploymentHistory = typeof employment_history.$inferInsert;

/**
 * Lead magnet subscribers table - for resume template downloads
 */
export const lead_magnet_subscribers = mysqlTable("lead_magnet_subscribers", {
  id: int("id").autoincrement().primaryKey(),
  email: varchar("email", { length: 320 }).notNull(),
  source: varchar("source", { length: 100 }), // e.g., "blog_post", "exit_popup"
  blogPostId: int("blogPostId"), // If downloaded from a blog post
  subscribedAt: timestamp("subscribedAt").defaultNow().notNull(),
});

export type LeadMagnetSubscriber = typeof lead_magnet_subscribers.$inferSelect;
export type InsertLeadMagnetSubscriber = typeof lead_magnet_subscribers.$inferInsert;
