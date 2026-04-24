import {
  pgTable,
  text,
  timestamp,
  uuid,
  decimal,
  integer,
  boolean,
  jsonb,
  pgEnum,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Enums
export const bookingStatusEnum = pgEnum("booking_status", [
  "pending",
  "confirmed",
  "in_progress",
  "completed",
  "cancelled",
]);

export const paymentStatusEnum = pgEnum("payment_status", [
  "pending",
  "paid",
  "failed",
  "refunded",
]);

export const userRoleEnum = pgEnum("user_role", ["admin", "user"]);

export const leadStatusEnum = pgEnum("lead_status", [
  "new",
  "contacted",
  "booked",
  "rejected",
]);

// Users table (for admin auth)
export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  name: text("name"),
  role: userRoleEnum("role").default("user").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Products/Services table
export const products = pgTable("products", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  shortDescription: text("short_description"),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  durationMinutes: integer("duration_minutes").notNull().default(60),
  imageUrl: text("image_url"),
  features: jsonb("features").$type<string[]>().default([]),
  isActive: boolean("is_active").default(true).notNull(),
  isSubscription: boolean("is_subscription").default(false).notNull(),
  subscriptionInterval: text("subscription_interval"), // 'monthly' | 'yearly'
  sortOrder: integer("sort_order").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Add-ons table
export const addons = pgTable("addons", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  durationMinutes: integer("duration_minutes").default(0).notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  sortOrder: integer("sort_order").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Bookings table
export const bookings = pgTable("bookings", {
  id: uuid("id").defaultRandom().primaryKey(),
  productId: uuid("product_id")
    .references(() => products.id)
    .notNull(),
  customerName: text("customer_name").notNull(),
  customerEmail: text("customer_email").notNull(),
  customerPhone: text("customer_phone").notNull(),
  address: text("address").notNull(),
  addressNotes: text("address_notes"),
  scheduledDate: timestamp("scheduled_date").notNull(),
  scheduledEndDate: timestamp("scheduled_end_date").notNull(),
  totalPrice: decimal("total_price", { precision: 10, scale: 2 }).notNull(),
  totalDurationMinutes: integer("total_duration_minutes").notNull(),
  status: bookingStatusEnum("status").default("pending").notNull(),
  paymentStatus: paymentStatusEnum("payment_status").default("pending").notNull(),
  paymentProvider: text("payment_provider"),
  paymentId: text("payment_id"),
  addonIds: jsonb("addon_ids").$type<string[]>().default([]),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Leads table (contact form submissions)
export const leads = pgTable("leads", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  message: text("message").notNull(),
  photos: jsonb("photos").$type<string[]>().default([]),
  source: text("source").default("contact_form"),
  status: leadStatusEnum("status").default("new").notNull(),
  notes: text("notes"),
  isRead: boolean("is_read").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Availability / blocked time slots
export const blockedSlots = pgTable("blocked_slots", {
  id: uuid("id").defaultRandom().primaryKey(),
  startTime: timestamp("start_time").notNull(),
  endTime: timestamp("end_time").notNull(),
  reason: text("reason"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Settings table for app configuration
export const settings = pgTable("settings", {
  id: uuid("id").defaultRandom().primaryKey(),
  key: text("key").notNull().unique(),
  value: jsonb("value"),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Dashboard stats table (updated via triggers)
export const dashboardStats = pgTable("dashboard_stats", {
  id: text("id").primaryKey().default("main"), // Single row
  bookingsToday: integer("bookings_today").default(0).notNull(),
  bookingsTodayDate: timestamp("bookings_today_date").defaultNow().notNull(),
  bookingsTotal: integer("bookings_total").default(0).notNull(),
  leadsThisWeek: integer("leads_this_week").default(0).notNull(),
  leadsWeekStart: timestamp("leads_week_start").defaultNow().notNull(),
  leadsTotal: integer("leads_total").default(0).notNull(),
  revenueMtd: decimal("revenue_mtd", { precision: 10, scale: 2 }).default("0").notNull(),
  revenueMonth: integer("revenue_month").default(1).notNull(),
  revenueYear: integer("revenue_year").default(2024).notNull(),
  revenueTotal: decimal("revenue_total", { precision: 10, scale: 2 }).default("0").notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Relations
export const productsRelations = relations(products, ({ many }) => ({
  bookings: many(bookings),
}));

export const bookingsRelations = relations(bookings, ({ one }) => ({
  product: one(products, {
    fields: [bookings.productId],
    references: [products.id],
  }),
}));

// Types
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;

export type Addon = typeof addons.$inferSelect;
export type NewAddon = typeof addons.$inferInsert;

export type Booking = typeof bookings.$inferSelect;
export type NewBooking = typeof bookings.$inferInsert;

export type Lead = typeof leads.$inferSelect;
export type NewLead = typeof leads.$inferInsert;

export type BlockedSlot = typeof blockedSlots.$inferSelect;
export type NewBlockedSlot = typeof blockedSlots.$inferInsert;

export type Setting = typeof settings.$inferSelect;
export type NewSetting = typeof settings.$inferInsert;

export type DashboardStats = typeof dashboardStats.$inferSelect;
