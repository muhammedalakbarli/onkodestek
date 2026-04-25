import {
  pgTable,
  serial,
  text,
  varchar,
  integer,
  numeric,
  timestamp,
  pgEnum,
  boolean,
  primaryKey,
} from "drizzle-orm/pg-core";

// ── Enums ────────────────────────────────────────────────────────────────────

export const patientStatusEnum = pgEnum("patient_status", [
  "pending",    // müraciət gözləyir
  "verified",   // sənədlər yoxlanıldı
  "active",     // aktiv yığım
  "funded",     // tam maliyyələşdirildi
  "closed",     // bağlandı
]);

export const transactionTypeEnum = pgEnum("transaction_type", [
  "donation",   // ianə daxil oldu
  "expense",    // xərc edildi
]);

export const expenseCategoryEnum = pgEnum("expense_category", [
  "medication",     // dərman
  "treatment",      // müalicə
  "consultation",   // konsultasiya
  "transport",      // nəqliyyat
  "other",          // digər
]);

export const userRoleEnum = pgEnum("user_role", [
  "admin",   // tam idarəetmə
  "donor",   // ianəçi
]);

// ── Auth: Users ───────────────────────────────────────────────────────────────

export const users = pgTable("users", {
  id:            text("id").primaryKey(),
  name:          text("name"),
  email:         text("email").unique(),
  emailVerified: timestamp("email_verified", { mode: "date" }),
  image:         text("image"),
  role:          userRoleEnum("role").notNull().default("donor"),
  createdAt:     timestamp("created_at").notNull().defaultNow(),
});

export const accounts = pgTable("accounts", {
  userId:            text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  type:              text("type").notNull(),
  provider:          text("provider").notNull(),
  providerAccountId: text("provider_account_id").notNull(),
  refresh_token:     text("refresh_token"),
  access_token:      text("access_token"),
  expires_at:        integer("expires_at"),
  token_type:        text("token_type"),
  scope:             text("scope"),
  id_token:          text("id_token"),
  session_state:     text("session_state"),
}, (t) => [primaryKey({ columns: [t.provider, t.providerAccountId] })]);

export const sessions = pgTable("sessions", {
  sessionToken: text("session_token").primaryKey(),
  userId:       text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  expires:      timestamp("expires", { mode: "date" }).notNull(),
});

export const verificationTokens = pgTable("verification_tokens", {
  identifier: text("identifier").notNull(),
  token:      text("token").notNull(),
  expires:    timestamp("expires", { mode: "date" }).notNull(),
}, (t) => [primaryKey({ columns: [t.identifier, t.token] })]);

// ── Patients ──────────────────────────────────────────────────────────────────

export const patients = pgTable("patients", {
  id:              serial("id").primaryKey(),
  trackId:         varchar("track_id", { length: 12 }).unique(), // izləmə kodu (OKD-XXXXXX)
  telegramId:      varchar("telegram_id", { length: 50 }),
  fullName:        varchar("full_name", { length: 255 }).notNull(),
  age:             integer("age"),
  diagnosis:       text("diagnosis").notNull(),
  hospitalName:    varchar("hospital_name", { length: 255 }),
  contactPhone:    varchar("contact_phone", { length: 50 }),
  story:           text("story"),
  goalAmount:      numeric("goal_amount", { precision: 12, scale: 2 }).notNull(),
  collectedAmount: numeric("collected_amount", { precision: 12, scale: 2 }).notNull().default("0"),
  status:          patientStatusEnum("status").notNull().default("pending"),
  isPublic:        boolean("is_public").notNull().default(false),
  documentUrl:     text("document_url"),
  photoUrl:        text("photo_url"),
  createdAt:       timestamp("created_at").notNull().defaultNow(),
  updatedAt:       timestamp("updated_at").notNull().defaultNow(),
});

// ── Transactions ──────────────────────────────────────────────────────────────

export const transactions = pgTable("transactions", {
  id:              serial("id").primaryKey(),
  patientId:       integer("patient_id").notNull().references(() => patients.id),
  donorUserId:     text("donor_user_id").references(() => users.id), // login olmuş donor
  type:            transactionTypeEnum("type").notNull(),
  amount:          numeric("amount", { precision: 12, scale: 2 }).notNull(),
  category:        expenseCategoryEnum("category"),
  description:     text("description"),
  receiptUrl:      text("receipt_url"),
  donorName:       varchar("donor_name", { length: 255 }),
  donorTelegramId: varchar("donor_telegram_id", { length: 50 }),
  isAnonymous:     boolean("is_anonymous").notNull().default(false),
  createdAt:       timestamp("created_at").notNull().defaultNow(),
});

// ── Patient Updates ───────────────────────────────────────────────────────────

export const patientUpdates = pgTable("patient_updates", {
  id:        serial("id").primaryKey(),
  patientId: integer("patient_id").notNull().references(() => patients.id, { onDelete: "cascade" }),
  content:   text("content").notNull(),
  photoUrl:  text("photo_url"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// ── Volunteer Requests ────────────────────────────────────────────────────────

export const volunteerRequests = pgTable("volunteer_requests", {
  id:         serial("id").primaryKey(),
  fullName:   varchar("full_name", { length: 255 }).notNull(),
  email:      varchar("email", { length: 255 }).notNull(),
  phone:      varchar("phone", { length: 50 }),
  area:       varchar("area", { length: 100 }).notNull(),
  message:    text("message"),
  isReviewed: boolean("is_reviewed").notNull().default(false),
  createdAt:  timestamp("created_at").notNull().defaultNow(),
});

// ── Platform Donations ────────────────────────────────────────────────────────

export const platformDonations = pgTable("platform_donations", {
  id:          serial("id").primaryKey(),
  donorName:   varchar("donor_name", { length: 255 }),
  amount:      numeric("amount", { precision: 12, scale: 2 }).notNull(),
  isAnonymous: boolean("is_anonymous").notNull().default(false),
  note:        text("note"),
  createdAt:   timestamp("created_at").notNull().defaultNow(),
});

// ── Types ─────────────────────────────────────────────────────────────────────

export type Patient            = typeof patients.$inferSelect;
export type NewPatient         = typeof patients.$inferInsert;
export type Transaction        = typeof transactions.$inferSelect;
export type NewTransaction     = typeof transactions.$inferInsert;
export type User               = typeof users.$inferSelect;
export type VolunteerRequest   = typeof volunteerRequests.$inferSelect;
export type PlatformDonation   = typeof platformDonations.$inferSelect;
