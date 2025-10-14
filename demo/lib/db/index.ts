import { drizzle as drizzleSqlite } from "drizzle-orm/better-sqlite3";
import { drizzle as drizzleNeon } from "drizzle-orm/neon-serverless";
import Database from "better-sqlite3";
import { neon } from "@neondatabase/serverless";
import * as schema from "./schema";

// Use Postgres in production (Vercel), SQLite locally
const isProduction = process.env.POSTGRES_URL;

export const db = isProduction
  ? drizzleNeon(neon(process.env.POSTGRES_URL!), { schema })
  : drizzleSqlite(new Database("./local.db"), { schema });
