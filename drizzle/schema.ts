import { integer, pgEnum, pgTable, serial, text, timestamp, varchar } from "drizzle-orm/pg-core";

// Define all enums first
export const roleEnum = pgEnum("role", ["user", "admin"]);
export const orderStatusEnum = pgEnum("order_status", ["pending", "completed", "cancelled", "failed"]);
export const contactStatusEnum = pgEnum("contact_status", ["new", "contacted", "converted", "archived"]);
export const serviceTypeEnum = pgEnum("service_type", ["individual", "package", "addon"]);
export const discountTypeEnum = pgEnum("discount_type", ["percentage", "fixed"]);
export const socialMediaStatusEnum = pgEnum("social_media_status", ["pending", "posted", "failed"]);
export const employmentStatusEnum = pgEnum("employment_status", [
  "employed_full_time",
  "employed_part_time", 
  "casual",
  "contractor",
  "unemployed",
  "student",
  "other"
]);
export const intakeStatusEnum = pgEnum("intake_status", ["pending", "in_progress", "completed"]);
export const employmentTypeEnum = pgEnum("employment_type", ["full_time", "part_time", "casual", "contract"]);
export const emailStatusEnum = pgEnum("email_status", ["sent", "failed", "pending"]);

/**
 * Core user table backing auth flow.
 * Compatible with NextAuth.js v5 and custom authentication.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = pgTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: serial("id").primaryKey(),
  
  // NextAuth.js fields
  name: text("name"),
  email: varchar("email", { length: 320 }).unique(),
  emailVerified: timestamp("emailVerified"),
  image: text("image"),
  
  // Custom authentication fields
  password: text("password"), // Hashed password for email/password auth
  
  // Legacy Manus OAuth field (optional, can be removed after migration)
  openId: varchar("openId", { length: 64 }).unique(),
  
  // Application-specific fields
  loginMethod: varchar("loginMethod", { length: 64 }), // 'email', 'google', 'github', etc.
  role: roleEnum("role").default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * NextAuth.js accounts table - stores OAuth provider connections
 */
export const accounts = pgTable("accounts", {
  id: serial("id").primaryKey(),
  userId: integer("userId").notNull(),
  type: varchar("type", { length: 255 }).notNull(),
  provider: varchar("provider", { length: 255 }).notNull(),
  providerAccountId: varchar("providerAccountId", { length: 255 }).notNull(),
  refresh_token: text("refresh_token"),
  access_token: text("access_token"),
  expires_at: integer("expires_at"),
  token_type: varchar("token_type", { length: 255 }),
  scope: text("scope"),
  id_token: text("id_token"),
  session_state: text("session_state"),
});

export type Account = typeof accounts.$inferSelect;
export type InsertAccount = typeof accounts.$inferInsert;

/**
 * NextAuth.js sessions table - stores active user sessions
 */
export const sessions = pgTable("sessions", {
  id: serial("id").primaryKey(),
  sessionToken: varchar("sessionToken", { length: 255 }).notNull().unique(),
  userId: integer("userId").notNull(),
  expires: timestamp("expires").notNull(),
});

export type Session = typeof sessions.$inferSelect;
export type InsertSession = typeof sessions.$inferInsert;

/**
 * NextAuth.js verification tokens table - for email verification and password reset
 */
export const verificationTokens = pgTable("verification_tokens", {
  identifier: varchar("identifier", { length: 255 }).notNull(),
  token: varchar("token", { length: 255 }).notNull().unique(),
  expires: timestamp("expires").notNull(),
});

export type VerificationToken = typeof verificationTokens.$inferSelect;
export type InsertVerificationToken = typeof verificationTokens.$inferInsert;

/**
 * Orders table for tracking resume service purchases
 */
export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  userId: integer("userId"),
  packageName: varchar("packageName", { length: 100 }).notNull(),
  amount: varchar("amount", { length: 20 }).notNull(),
  currency: varchar("currency", { length: 3 }).default("AUD").notNull(),
  paypalOrderId: varchar("paypalOrderId", { length: 255 }),
  paypalPayerId: varchar("paypalPayerId", { length: 255 }),
  status: orderStatusEnum("status").default("pending").notNull(),
  customerName: varchar("customerName", { length: 255 }),
  customerEmail: varchar("customerEmail", { length: 320 }),
  customerPhone: varchar("customerPhone", { length: 50 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type Order = typeof orders.$inferSelect;
export type InsertOrder = typeof orders.$inferInsert;

/**
 * Blog posts table for managing blog content
 */
export const blog_posts = pgTable("blog_posts", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  content: text("content").notNull(),
  excerpt: text("excerpt").notNull(),
  metaTitle: varchar("metaTitle", { length: 60 }), // SEO meta title (max 60 chars)
  metaDescription: text("metaDescription"), // SEO meta description (max 160 chars)
  category: varchar("category", { length: 100 }).notNull(), // Legacy field, will use categoryId
  categoryId: integer("categoryId"),
  image: varchar("image", { length: 500 }),
  readTime: varchar("readTime", { length: 50 }),
  published: integer("published").default(0).notNull(), // 0 = draft, 1 = published
  scheduledPublishDate: timestamp("scheduledPublishDate"),
  viewCount: integer("viewCount").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type BlogPost = typeof blog_posts.$inferSelect;
export type InsertBlogPost = typeof blog_posts.$inferInsert;

/**
 * Uploaded images table for media library
 */
export const uploaded_images = pgTable("uploaded_images", {
  id: serial("id").primaryKey(),
  filename: varchar("filename", { length: 255 }).notNull(),
  url: text("url").notNull(), // Original image URL
  key: varchar("key", { length: 500 }).notNull(),
  contentType: varchar("contentType", { length: 100 }).notNull(),
  size: integer("size"),
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
export const faq_search_analytics = pgTable("faq_search_analytics", {
  id: serial("id").primaryKey(),
  query: varchar("query", { length: 255 }).notNull(),
  resultsCount: integer("resultsCount").notNull(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
  userAgent: text("userAgent"),
  ipAddress: varchar("ipAddress", { length: 45 }), // IPv6 compatible
});

export type FaqSearchAnalytics = typeof faq_search_analytics.$inferSelect;
export type InsertFaqSearchAnalytics = typeof faq_search_analytics.$inferInsert;

/**
 * Contact form submissions table
 */
export const contact_submissions = pgTable("contact_submissions", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  phone: varchar("phone", { length: 50 }),
  serviceInterest: varchar("serviceInterest", { length: 100 }),
  message: text("message").notNull(),
  resumeFileUrl: text("resumeFileUrl"),
  status: contactStatusEnum("status").default("new").notNull(),
  notes: text("notes"),
  submittedAt: timestamp("submittedAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type ContactSubmission = typeof contact_submissions.$inferSelect;
export type InsertContactSubmission = typeof contact_submissions.$inferInsert;

/**
 * Testimonials table for client success stories
 */
export const testimonials = pgTable("testimonials", {
  id: serial("id").primaryKey(),
  clientName: varchar("clientName", { length: 255 }).notNull(),
  clientTitle: varchar("clientTitle", { length: 255 }),
  clientPhoto: varchar("clientPhoto", { length: 500 }),
  rating: integer("rating").notNull(), // 1-5 stars
  testimonialText: text("testimonialText").notNull(),
  serviceUsed: varchar("serviceUsed", { length: 100 }),
  featured: integer("featured").default(0).notNull(), // 0 = not featured, 1 = featured on homepage
  approved: integer("approved").default(1).notNull(), // 0 = pending, 1 = approved
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Testimonial = typeof testimonials.$inferSelect;
export type InsertTestimonial = typeof testimonials.$inferInsert;

/**
 * Blog categories table
 */
export const blog_categories = pgTable("blog_categories", {
  id: serial("id").primaryKey(),
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
export const blog_tags = pgTable("blog_tags", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 50 }).notNull().unique(),
  slug: varchar("slug", { length: 50 }).notNull().unique(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type BlogTag = typeof blog_tags.$inferSelect;
export type InsertBlogTag = typeof blog_tags.$inferInsert;

/**
 * Junction table for blog posts and tags (many-to-many)
 */
export const blog_post_tags = pgTable("blog_post_tags", {
  id: serial("id").primaryKey(),
  postId: integer("postId").notNull(),
  tagId: integer("tagId").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type BlogPostTag = typeof blog_post_tags.$inferSelect;
export type InsertBlogPostTag = typeof blog_post_tags.$inferInsert;
/**
 * Services table for individual resume services and packages
 */
export const services = pgTable("services", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  type: serviceTypeEnum("type").notNull(),
  category: varchar("category", { length: 100 }), // e.g., "Resume", "Cover Letter", "LinkedIn"
  tier: varchar("tier", { length: 50 }), // e.g., "Entry Level", "Professional", "Executive"
  price: varchar("price", { length: 20 }).notNull(),
  originalPrice: varchar("originalPrice", { length: 20 }), // For showing discounts
  features: text("features"), // JSON string of features array
  active: integer("active").default(1).notNull(),
  sortOrder: integer("sortOrder").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type Service = typeof services.$inferSelect;
export type InsertService = typeof services.$inferInsert;

/**
 * Cart items table for user shopping carts
 */
export const cart_items = pgTable("cart_items", {
  id: serial("id").primaryKey(),
  userId: integer("userId"),
  sessionId: varchar("sessionId", { length: 255 }), // For guest users
  serviceId: integer("serviceId").notNull(),
  quantity: integer("quantity").default(1).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type CartItem = typeof cart_items.$inferSelect;
export type InsertCartItem = typeof cart_items.$inferInsert;

/**
 * Order items table for tracking individual items in orders
 */
export const order_items = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("orderId").notNull(),
  serviceId: integer("serviceId").notNull(),
  serviceName: varchar("serviceName", { length: 255 }).notNull(),
  quantity: integer("quantity").default(1).notNull(),
  price: varchar("price", { length: 20 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type OrderItem = typeof order_items.$inferSelect;
export type InsertOrderItem = typeof order_items.$inferInsert;

/**
 * Promo codes table for discount codes
 */
export const promo_codes = pgTable("promo_codes", {
  id: serial("id").primaryKey(),
  code: varchar("code", { length: 50 }).notNull().unique(),
  description: text("description"),
  discountType: discountTypeEnum("discountType").notNull(),
  discountValue: varchar("discountValue", { length: 20 }).notNull(), // Percentage (e.g., "10") or fixed amount (e.g., "50")
  minPurchase: varchar("minPurchase", { length: 20 }), // Minimum purchase amount to use code
  maxUses: integer("maxUses"), // Maximum number of times code can be used
  usedCount: integer("usedCount").default(0).notNull(),
  active: integer("active").default(1).notNull(),
  expiresAt: timestamp("expiresAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type PromoCode = typeof promo_codes.$inferSelect;
export type InsertPromoCode = typeof promo_codes.$inferInsert;

/**
 * Case studies table for client success stories
 */
export const case_studies = pgTable("case_studies", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  category: varchar("category", { length: 100 }).notNull(), // e.g., "Career Change Success", "Executive Promotion"
  clientName: varchar("clientName", { length: 255 }).notNull(),
  challenge: text("challenge").notNull(), // The problem/situation the client faced
  solution: text("solution").notNull(), // What we did to help
  result: text("result").notNull(), // The outcome/success achieved
  testimonialQuote: text("testimonialQuote"), // Optional client testimonial
  image: varchar("image", { length: 500 }), // Featured image for the case study
  beforeResumeImage: varchar("beforeResumeImage", { length: 500 }), // Before resume screenshot/image
  afterResumeImage: varchar("afterResumeImage", { length: 500 }), // After resume screenshot/image
  published: integer("published").default(0).notNull(), // 0 = draft, 1 = published
  featured: integer("featured").default(0).notNull(), // 0 = not featured, 1 = featured on homepage
  viewCount: integer("viewCount").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type CaseStudy = typeof case_studies.$inferSelect;
export type InsertCaseStudy = typeof case_studies.$inferInsert;

/**
 * Social media posts table for tracking auto-posted content
 */
export const social_media_posts = pgTable("social_media_posts", {
  id: serial("id").primaryKey(),
  blogPostId: integer("blogPostId"), // Reference to blog_posts table
  caseStudyId: integer("caseStudyId"), // Reference to case_studies table
  platform: varchar("platform", { length: 50 }).notNull(), // e.g., "linkedin", "facebook", "twitter"
  postText: text("postText").notNull(),
  postUrl: varchar("postUrl", { length: 500 }), // URL to the social media post
  status: socialMediaStatusEnum("status").default("pending").notNull(),
  scheduledFor: timestamp("scheduledFor"),
  postedAt: timestamp("postedAt"),
  errorMessage: text("errorMessage"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type SocialMediaPost = typeof social_media_posts.$inferSelect;
export type InsertSocialMediaPost = typeof social_media_posts.$inferInsert;

/**
 * Email subscribers table for lead capture
 */
export const email_subscribers = pgTable("email_subscribers", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }),
  source: varchar("source", { length: 100 }), // e.g., "case_study_download", "newsletter_signup"
  caseStudyId: integer("caseStudyId"), // Reference to case study if downloaded from case study page
  subscribed: integer("subscribed").default(1).notNull(), // 0 = unsubscribed, 1 = subscribed
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type EmailSubscriber = typeof email_subscribers.$inferSelect;
export type InsertEmailSubscriber = typeof email_subscribers.$inferInsert;

/**
 * Lead magnet subscribers table for tracking resume template downloads
 */
export const leadMagnetSubscribers = pgTable("lead_magnet_subscribers", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  downloadedTemplate: varchar("downloadedTemplate", { length: 255 }).notNull(),
  sourcePost: varchar("sourcePost", { length: 500 }), // Which blog post they downloaded from
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type LeadMagnetSubscriber = typeof leadMagnetSubscribers.$inferSelect;
export type InsertLeadMagnetSubscriber = typeof leadMagnetSubscribers.$inferInsert;

/**
 * Client intake records table - stores comprehensive career information after payment
 */
export const client_intake_records = pgTable("client_intake_records", {
  id: serial("id").primaryKey(),
  
  // Link to order and payment
  orderId: integer("orderId"),
  paypalTransactionId: varchar("paypalTransactionId", { length: 255 }),
  purchasedService: varchar("purchasedService", { length: 255 }),
  
  // Section 1: Personal Details
  firstName: varchar("firstName", { length: 100 }).notNull(),
  lastName: varchar("lastName", { length: 100 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  phone: varchar("phone", { length: 50 }).notNull(),
  cityState: varchar("cityState", { length: 255 }),
  bestContactTime: text("bestContactTime"),
  
  // Section 2: LinkedIn Profile (NEW)
  linkedinUrl: varchar("linkedinUrl", { length: 500 }),
  
  // Section 3: Current Situation
  employmentStatus: employmentStatusEnum("employmentStatus"),
  currentJobTitle: varchar("currentJobTitle", { length: 255 }),
  currentEmployer: varchar("currentEmployer", { length: 255 }),
  currentRoleOverview: text("currentRoleOverview"),
  
  // Section 4: Target Roles and Career Goals
  targetRoles: text("targetRoles"),
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
  languageSkills: text("languageSkills"), // NEW: e.g., "Fluent in Spanish, conversational French"
  
  // Section 8.1: Professional Development (NEW)
  shortCoursesTraining: text("shortCoursesTraining"), // Seminars, conferences, in-house training
  professionalMemberships: text("professionalMemberships"), // Organisation, membership type, year joined
  volunteerWork: text("volunteerWork"), // Organisation, role, contributions
  awardsRecognition: text("awardsRecognition"), // Performance appraisals, awards, client compliments
  publications: text("publications"), // Papers written, professional presentations
  
  // Section 9: Additional Information
  employmentGaps: text("employmentGaps"),
  keyAchievements: text("keyAchievements"),
  preferredStyle: text("preferredStyle"),
  hearAboutUs: varchar("hearAboutUs", { length: 255 }),
  
  // Section 10: Referees (NEW)
  referees: text("referees"), // JSON array of referee objects
  
  // File uploads
  resumeFileUrl: text("resumeFileUrl"),
  supportingDocsUrls: text("supportingDocsUrls"), // JSON array of URLs
  
  // Metadata
  status: intakeStatusEnum("status").default("pending").notNull(),
  adminNotes: text("adminNotes"),
  submittedAt: timestamp("submittedAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type ClientIntakeRecord = typeof client_intake_records.$inferSelect;
export type InsertClientIntakeRecord = typeof client_intake_records.$inferInsert;

/**
 * Employment history table - stores job entries for each intake record
 */
export const employment_history = pgTable("employment_history", {
  id: serial("id").primaryKey(),
  intakeRecordId: integer("intakeRecordId").notNull(),
  
  jobTitle: varchar("jobTitle", { length: 255 }).notNull(),
  employer: varchar("employer", { length: 255 }).notNull(),
  location: varchar("location", { length: 255 }),
  startDate: varchar("startDate", { length: 20 }).notNull(), // Format: "MM/YYYY"
  endDate: varchar("endDate", { length: 20 }).notNull(), // Format: "MM/YYYY" or "Current"
  employmentType: employmentTypeEnum("employmentType").notNull(),
  keyResponsibilities: text("keyResponsibilities"),
  keyAchievements: text("keyAchievements"),
  
  sortOrder: integer("sortOrder").default(0), // For maintaining order of jobs
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type EmploymentHistory = typeof employment_history.$inferSelect;
export type InsertEmploymentHistory = typeof employment_history.$inferInsert;

/**
 * Draft intake records table - for autosave functionality
 */
export const draft_intake_records = pgTable("draft_intake_records", {
  id: serial("id").primaryKey(),
  
  // Link to transaction and email for retrieval
  paypalTransactionId: varchar("paypalTransactionId", { length: 255 }),
  email: varchar("email", { length: 320 }),
  resumeToken: varchar("resumeToken", { length: 64 }).unique(), // Secure token for resume-later link
  
  // Store entire form data as JSON
  formData: text("formData").notNull(), // JSON string of all form fields
  
  // Track completion status
  completed: integer("completed").default(0).notNull(), // 0 = draft, 1 = submitted
  reminderSent: integer("reminderSent").default(0).notNull(), // Track if reminder email sent
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type DraftIntakeRecord = typeof draft_intake_records.$inferSelect;
export type InsertDraftIntakeRecord = typeof draft_intake_records.$inferInsert;

/**
 * Resume samples table for before/after gallery
 */
export const resume_samples = pgTable("resume_samples", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  industry: varchar("industry", { length: 100 }).notNull(),
  beforeImage: varchar("beforeImage", { length: 500 }).notNull(),
  afterImage: varchar("afterImage", { length: 500 }).notNull(),
  description: text("description"),
  improvements: text("improvements"), // JSON string of improvement points
  sortOrder: integer("sortOrder").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type ResumeSample = typeof resume_samples.$inferSelect;
export type InsertResumeSample = typeof resume_samples.$inferInsert;


/**
 * Email logs table for tracking email delivery
 */
export const email_logs = pgTable("email_logs", {
  id: serial("id").primaryKey(),
  emailType: varchar("emailType", { length: 100 }).notNull(), // contact_form, order_confirmation, review_request, lead_magnet, test, etc.
  recipientEmail: varchar("recipientEmail", { length: 320 }).notNull(),
  recipientName: varchar("recipientName", { length: 255 }),
  subject: varchar("subject", { length: 500 }),
  status: emailStatusEnum("status").default("pending").notNull(),
  errorMessage: text("errorMessage"), // Store error details if failed
  metadata: text("metadata"), // JSON string for additional data (orderId, contactId, etc.)
  sentAt: timestamp("sentAt").defaultNow().notNull(),
});

export type EmailLog = typeof email_logs.$inferSelect;
export type InsertEmailLog = typeof email_logs.$inferInsert;
