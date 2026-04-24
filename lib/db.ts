import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "@/drizzle/schema";

const connectionString = process.env.DATABASE_URL!;

// Serverless mühit: hər Function instance üçün 1 connection
// SSL: production Postgres (Neon, Supabase, Railway) üçün lazımdır
const client = postgres(connectionString, {
  max:     1,
  ssl:     connectionString?.includes("localhost") ? false : "require",
  idle_timeout: 20,
  connect_timeout: 10,
});

export const db = drizzle(client, { schema });
