import { relations } from "drizzle-orm";
import {
  users, accounts, sessions, orders, order_items, blog_posts,
  blog_categories, blog_tags, blog_post_tags, services, cart_items,
  case_studies, social_media_posts, email_subscribers,
  client_intake_records, employment_history,
} from "./schema";

export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
  sessions: many(sessions),
  orders: many(orders),
  cartItems: many(cart_items),
}));

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, { fields: [accounts.userId], references: [users.id] }),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));

export const ordersRelations = relations(orders, ({ one, many }) => ({
  user: one(users, { fields: [orders.userId], references: [users.id] }),
  items: many(order_items),
  intakeRecords: many(client_intake_records),
}));

export const orderItemsRelations = relations(order_items, ({ one }) => ({
  order: one(orders, { fields: [order_items.orderId], references: [orders.id] }),
  service: one(services, { fields: [order_items.serviceId], references: [services.id] }),
}));

export const blogPostsRelations = relations(blog_posts, ({ one, many }) => ({
  category: one(blog_categories, { fields: [blog_posts.categoryId], references: [blog_categories.id] }),
  tags: many(blog_post_tags),
  socialMediaPosts: many(social_media_posts),
}));

export const blogCategoriesRelations = relations(blog_categories, ({ many }) => ({
  posts: many(blog_posts),
}));

export const blogTagsRelations = relations(blog_tags, ({ many }) => ({
  postTags: many(blog_post_tags),
}));

export const blogPostTagsRelations = relations(blog_post_tags, ({ one }) => ({
  post: one(blog_posts, { fields: [blog_post_tags.postId], references: [blog_posts.id] }),
  tag: one(blog_tags, { fields: [blog_post_tags.tagId], references: [blog_tags.id] }),
}));

export const servicesRelations = relations(services, ({ many }) => ({
  cartItems: many(cart_items),
  orderItems: many(order_items),
}));

export const cartItemsRelations = relations(cart_items, ({ one }) => ({
  user: one(users, { fields: [cart_items.userId], references: [users.id] }),
  service: one(services, { fields: [cart_items.serviceId], references: [services.id] }),
}));

export const caseStudiesRelations = relations(case_studies, ({ many }) => ({
  socialMediaPosts: many(social_media_posts),
  emailSubscribers: many(email_subscribers),
}));

export const socialMediaPostsRelations = relations(social_media_posts, ({ one }) => ({
  blogPost: one(blog_posts, { fields: [social_media_posts.blogPostId], references: [blog_posts.id] }),
  caseStudy: one(case_studies, { fields: [social_media_posts.caseStudyId], references: [case_studies.id] }),
}));

export const emailSubscribersRelations = relations(email_subscribers, ({ one }) => ({
  caseStudy: one(case_studies, { fields: [email_subscribers.caseStudyId], references: [case_studies.id] }),
}));

export const clientIntakeRecordsRelations = relations(client_intake_records, ({ one, many }) => ({
  order: one(orders, { fields: [client_intake_records.orderId], references: [orders.id] }),
  employmentHistory: many(employment_history),
}));

export const employmentHistoryRelations = relations(employment_history, ({ one }) => ({
  intakeRecord: one(client_intake_records, { fields: [employment_history.intakeRecordId], references: [client_intake_records.id] }),
}));
