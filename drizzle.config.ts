import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "src/utils/userSchema.ts",
  dbCredentials: {
    url: 'postgresql://neondb_owner:npg_e34PyTNtXMSs@ep-sweet-shadow-a40pjvg7-pooler.us-east-1.aws.neon.tech/ExpensesDatabase?sslmode=require'
//replace with process.env.DATABASE_URL as string, //may work weird because its being passed as string
  }
});
