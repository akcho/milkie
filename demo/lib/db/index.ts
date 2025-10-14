import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as schema from "./schema";

// Use Neon Postgres for both local and production
const sql = neon(process.env.POSTGRES_URL!);
export const db = drizzle(sql, { schema });
