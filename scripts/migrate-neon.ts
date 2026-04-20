/**
 * Neon DB-ə yeni auth cədvəllərini və sütunları tətbiq edir.
 * Bir dəfəlik işlədilir: npx tsx scripts/migrate-neon.ts
 */
import { config } from "dotenv";
config({ path: ".env.production.local" });

import postgres from "postgres";

async function main() {
  const sql = postgres(process.env.DATABASE_URL!, { max: 1, ssl: "require" });

  console.log("Neon DB-ə qoşulunur...");

  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id text PRIMARY KEY,
      name text,
      email text UNIQUE,
      email_verified timestamp,
      image text,
      role text NOT NULL DEFAULT 'donor',
      created_at timestamp NOT NULL DEFAULT now()
    )
  `;
  console.log("✓ users cədvəli");

  await sql`
    CREATE TABLE IF NOT EXISTS accounts (
      user_id text NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      type text NOT NULL,
      provider text NOT NULL,
      provider_account_id text NOT NULL,
      refresh_token text,
      access_token text,
      expires_at integer,
      token_type text,
      scope text,
      id_token text,
      session_state text,
      PRIMARY KEY (provider, provider_account_id)
    )
  `;
  console.log("✓ accounts cədvəli");

  await sql`
    CREATE TABLE IF NOT EXISTS sessions (
      session_token text PRIMARY KEY,
      user_id text NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      expires timestamp NOT NULL
    )
  `;
  console.log("✓ sessions cədvəli");

  await sql`
    CREATE TABLE IF NOT EXISTS verification_tokens (
      identifier text NOT NULL,
      token text NOT NULL,
      expires timestamp NOT NULL,
      PRIMARY KEY (identifier, token)
    )
  `;
  console.log("✓ verification_tokens cədvəli");

  // patients.track_id
  await sql`ALTER TABLE patients ADD COLUMN IF NOT EXISTS track_id varchar(12)`;
  await sql`
    UPDATE patients
    SET track_id = 'OKD-' || LPAD(id::text, 6, '0')
    WHERE track_id IS NULL
  `;
  await sql`
    DO $$ BEGIN
      ALTER TABLE patients ADD CONSTRAINT patients_track_id_unique UNIQUE (track_id);
    EXCEPTION WHEN duplicate_object THEN null;
    END $$
  `;
  console.log("✓ patients.track_id");

  // transactions.donor_user_id
  await sql`ALTER TABLE transactions ADD COLUMN IF NOT EXISTS donor_user_id text`;
  await sql`
    DO $$ BEGIN
      ALTER TABLE transactions
        ADD CONSTRAINT transactions_donor_user_id_fkey
        FOREIGN KEY (donor_user_id) REFERENCES users(id);
    EXCEPTION WHEN duplicate_object THEN null;
    END $$
  `;
  console.log("✓ transactions.donor_user_id");

  await sql.end();
  console.log("\n✅ Mirasiya tamamlandı!");
}

main().catch((err) => {
  console.error("Xəta:", err);
  process.exit(1);
});
