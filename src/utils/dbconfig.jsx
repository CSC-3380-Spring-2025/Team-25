import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';
const sql = neon('postgresql://neondb_owner:npg_e34PyTNtXMSs@ep-sweet-shadow-a40pjvg7-pooler.us-east-1.aws.neon.tech/ExpensesDatabase?sslmode=require');//replace with process.env.DATABASE_URL
const db = drizzle({ client: sql });
