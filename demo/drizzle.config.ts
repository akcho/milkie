import type { Config } from "drizzle-kit";

// Use Postgres in production, SQLite locally
const isProduction = process.env.POSTGRES_URL;

export default {
  schema: "./lib/db/schema.ts",
  out: "./drizzle",
  dialect: isProduction ? "postgresql" : "sqlite",
  dbCredentials: isProduction
    ? {
        url: process.env.POSTGRES_URL!,
      }
    : {
        url: "./local.db",
      },
} satisfies Config;
