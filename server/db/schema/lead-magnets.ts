import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const leadMagnetDownloads = pgTable("lead_magnet_downloads", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  leadMagnetType: text("lead_magnet_type").notNull().default("ats-resume-mistakes"),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  referrer: text("referrer"),
  downloadedAt: timestamp("downloaded_at").defaultNow().notNull(),
  emailSent: timestamp("email_sent"),
});
