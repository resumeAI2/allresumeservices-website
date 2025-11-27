import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Orders table for tracking resume service purchases
 */
export const orders = mysqlTable("orders", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId"),
  packageName: varchar("packageName", { length: 100 }).notNull(),
  amount: varchar("amount", { length: 20 }).notNull(),
  currency: varchar("currency", { length: 3 }).default("AUD").notNull(),
  paypalOrderId: varchar("paypalOrderId", { length: 255 }),
  paypalPayerId: varchar("paypalPayerId", { length: 255 }),
  status: mysqlEnum("status", ["pending", "completed", "cancelled", "failed"]).default("pending").notNull(),
  customerName: varchar("customerName", { length: 255 }),
  customerEmail: varchar("customerEmail", { length: 320 }),
  customerPhone: varchar("customerPhone", { length: 50 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Order = typeof orders.$inferSelect;
export type InsertOrder = typeof orders.$inferInsert;

/**
 * Blog posts table for managing blog content
 */
export const blog_posts = mysqlTable("blog_posts", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  content: text("content").notNull(),
  excerpt: text("excerpt").notNull(),
  category: varchar("category", { length: 100 }).notNull(), // Legacy field, will use categoryId
  categoryId: int("categoryId"),
  image: varchar("image", { length: 500 }),
  readTime: varchar("readTime", { length: 50 }),
  published: int("published").default(0).notNull(), // 0 = draft, 1 = published
  scheduledPublishDate: timestamp("scheduledPublishDate"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type BlogPost = typeof blog_posts.$inferSelect;
export type InsertBlogPost = typeof blog_posts.$inferInsert;

/**
 * Uploaded images table for media library
 */
export const uploaded_images = mysqlTable("uploaded_images", {
  id: int("id").autoincrement().primaryKey(),
  filename: varchar("filename", { length: 255 }).notNull(),
  url: text("url").notNull(), // Original image URL
  key: varchar("key", { length: 500 }).notNull(),
  contentType: varchar("contentType", { length: 100 }).notNull(),
  size: int("size"),
  altText: text("altText"),
  // Optimized image variants
  thumbnailUrl: text("thumbnailUrl"),
  smallUrl: text("smallUrl"),
  mediumUrl: text("mediumUrl"),
  largeUrl: text("largeUrl"),
  uploadedAt: timestamp("uploadedAt").defaultNow().notNull(),
});

export type UploadedImage = typeof uploaded_images.$inferSelect;
export type InsertUploadedImage = typeof uploaded_images.$inferInsert;

/**
 * FAQ search analytics table for tracking user search queries
 */
export const faq_search_analytics = mysqlTable("faq_search_analytics", {
  id: int("id").autoincrement().primaryKey(),
  query: varchar("query", { length: 255 }).notNull(),
  resultsCount: int("resultsCount").notNull(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
  userAgent: text("userAgent"),
  ipAddress: varchar("ipAddress", { length: 45 }), // IPv6 compatible
});

export type FaqSearchAnalytics = typeof faq_search_analytics.$inferSelect;
export type InsertFaqSearchAnalytics = typeof faq_search_analytics.$inferInsert;

/**
 * Contact form submissions table
 */
export const contact_submissions = mysqlTable("contact_submissions", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  phone: varchar("phone", { length: 50 }),
  serviceInterest: varchar("serviceInterest", { length: 100 }),
  message: text("message").notNull(),
  status: mysqlEnum("status", ["new", "contacted", "converted", "archived"]).default("new").notNull(),
  submittedAt: timestamp("submittedAt").defaultNow().notNull(),
});

export type ContactSubmission = typeof contact_submissions.$inferSelect;
export type InsertContactSubmission = typeof contact_submissions.$inferInsert;

/**
 * Testimonials table for client success stories
 */
export const testimonials = mysqlTable("testimonials", {
  id: int("id").autoincrement().primaryKey(),
  clientName: varchar("clientName", { length: 255 }).notNull(),
  clientTitle: varchar("clientTitle", { length: 255 }),
  clientPhoto: varchar("clientPhoto", { length: 500 }),
  rating: int("rating").notNull(), // 1-5 stars
  testimonialText: text("testimonialText").notNull(),
  serviceUsed: varchar("serviceUsed", { length: 100 }),
  featured: int("featured").default(0).notNull(), // 0 = not featured, 1 = featured on homepage
  approved: int("approved").default(1).notNull(), // 0 = pending, 1 = approved
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Testimonial = typeof testimonials.$inferSelect;
export type InsertTestimonial = typeof testimonials.$inferInsert;

/**
 * Blog categories table
 */
export const blog_categories = mysqlTable("blog_categories", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 100 }).notNull().unique(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  description: text("description"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type BlogCategory = typeof blog_categories.$inferSelect;
export type InsertBlogCategory = typeof blog_categories.$inferInsert;

/**
 * Blog tags table
 */
export const blog_tags = mysqlTable("blog_tags", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 50 }).notNull().unique(),
  slug: varchar("slug", { length: 50 }).notNull().unique(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type BlogTag = typeof blog_tags.$inferSelect;
export type InsertBlogTag = typeof blog_tags.$inferInsert;

/**
 * Junction table for blog posts and tags (many-to-many)
 */
export const blog_post_tags = mysqlTable("blog_post_tags", {
  id: int("id").autoincrement().primaryKey(),
  postId: int("postId").notNull(),
  tagId: int("tagId").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type BlogPostTag = typeof blog_post_tags.$inferSelect;
export type InsertBlogPostTag = typeof blog_post_tags.$inferInsert;