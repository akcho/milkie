import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { config } from "dotenv";

config({ path: ".env.local" });

const sql = neon(process.env.POSTGRES_URL);
const db = drizzle(sql);

const users = await db.execute(
  "SELECT id, email, stripe_customer_id FROM users ORDER BY created_at DESC LIMIT 5"
);
const subs = await db.execute(
  "SELECT id, user_id, status, current_period_end FROM subscriptions ORDER BY created_at DESC LIMIT 5"
);

console.log("Recent users:");
console.table(users.rows);
console.log("\nRecent subscriptions:");
console.table(subs.rows);
