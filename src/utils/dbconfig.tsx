import "dotenv/config";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./userSchema";

export const db = drizzle(neon(process.env.DATABASE_URL!), { schema });
//This is simply a config to make neon work with drizzle