CREATE TYPE "public"."expense_category" AS ENUM('medication', 'treatment', 'consultation', 'transport', 'other');--> statement-breakpoint
CREATE TYPE "public"."patient_status" AS ENUM('pending', 'verified', 'active', 'funded', 'closed');--> statement-breakpoint
CREATE TYPE "public"."transaction_type" AS ENUM('donation', 'expense');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('admin', 'donor');--> statement-breakpoint
CREATE TABLE "accounts" (
	"user_id" text NOT NULL,
	"type" text NOT NULL,
	"provider" text NOT NULL,
	"provider_account_id" text NOT NULL,
	"refresh_token" text,
	"access_token" text,
	"expires_at" integer,
	"token_type" text,
	"scope" text,
	"id_token" text,
	"session_state" text,
	CONSTRAINT "accounts_provider_provider_account_id_pk" PRIMARY KEY("provider","provider_account_id")
);
--> statement-breakpoint
CREATE TABLE "patients" (
	"id" serial PRIMARY KEY NOT NULL,
	"track_id" varchar(12),
	"telegram_id" varchar(50),
	"full_name" varchar(255) NOT NULL,
	"age" integer,
	"diagnosis" text NOT NULL,
	"hospital_name" varchar(255),
	"contact_phone" varchar(50),
	"story" text,
	"goal_amount" numeric(12, 2) NOT NULL,
	"collected_amount" numeric(12, 2) DEFAULT '0' NOT NULL,
	"status" "patient_status" DEFAULT 'pending' NOT NULL,
	"is_public" boolean DEFAULT false NOT NULL,
	"document_url" text,
	"photo_url" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "patients_track_id_unique" UNIQUE("track_id")
);
--> statement-breakpoint
CREATE TABLE "platform_donations" (
	"id" serial PRIMARY KEY NOT NULL,
	"donor_name" varchar(255),
	"amount" numeric(12, 2) NOT NULL,
	"is_anonymous" boolean DEFAULT false NOT NULL,
	"note" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"session_token" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"expires" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "transactions" (
	"id" serial PRIMARY KEY NOT NULL,
	"patient_id" integer NOT NULL,
	"donor_user_id" text,
	"type" "transaction_type" NOT NULL,
	"amount" numeric(12, 2) NOT NULL,
	"category" "expense_category",
	"description" text,
	"receipt_url" text,
	"donor_name" varchar(255),
	"donor_telegram_id" varchar(50),
	"is_anonymous" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text,
	"email" text,
	"email_verified" timestamp,
	"image" text,
	"role" "user_role" DEFAULT 'donor' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "verification_tokens" (
	"identifier" text NOT NULL,
	"token" text NOT NULL,
	"expires" timestamp NOT NULL,
	CONSTRAINT "verification_tokens_identifier_token_pk" PRIMARY KEY("identifier","token")
);
--> statement-breakpoint
CREATE TABLE "volunteer_requests" (
	"id" serial PRIMARY KEY NOT NULL,
	"full_name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"phone" varchar(50),
	"area" varchar(100) NOT NULL,
	"message" text,
	"is_reviewed" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_patient_id_patients_id_fk" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_donor_user_id_users_id_fk" FOREIGN KEY ("donor_user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;