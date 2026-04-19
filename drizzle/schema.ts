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

// ── Patients ──────────────────────────────────────────────────────────────────

export const patients = pgTable("patients", {
  id: serial("id").primaryKey(),
  telegramId: varchar("telegram_id", { length: 50 }),
  fullName: varchar("full_name", { length: 255 }).notNull(),
  age: integer("age"),
  diagnosis: text("diagnosis").notNull(),
  hospitalName: varchar("hospital_name", { length: 255 }),
  contactPhone: varchar("contact_phone", { length: 50 }),
  story: text("story"),
  goalAmount: numeric("goal_amount", { precision: 12, scale: 2 }).notNull(),
  collectedAmount: numeric("collected_amount", { precision: 12, scale: 2 })
    .notNull()
    .default("0"),
  status: patientStatusEnum("status").notNull().default("pending"),
  isPublic: boolean("is_public").notNull().default(false),
  documentUrl: text("document_url"),
  photoUrl: text("photo_url"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// ── Transactions ──────────────────────────────────────────────────────────────

export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  patientId: integer("patient_id")
    .notNull()
    .references(() => patients.id),
  type: transactionTypeEnum("type").notNull(),
  amount: numeric("amount", { precision: 12, scale: 2 }).notNull(),
  category: expenseCategoryEnum("category"),
  description: text("description"),
  receiptUrl: text("receipt_url"),       // xərc qəbzinin URL-i
  donorName: varchar("donor_name", { length: 255 }),
  donorTelegramId: varchar("donor_telegram_id", { length: 50 }),
  isAnonymous: boolean("is_anonymous").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// ── Types ─────────────────────────────────────────────────────────────────────

export type Patient = typeof patients.$inferSelect;
export type NewPatient = typeof patients.$inferInsert;
export type Transaction = typeof transactions.$inferSelect;
export type NewTransaction = typeof transactions.$inferInsert;
