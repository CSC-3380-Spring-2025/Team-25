// drizzle.config.ts
import { defineConfig } from "drizzle-kit";
import { config } from "dotenv";


config({ path: ".env.local" });          

export default defineConfig({
  dialect: "postgresql",

  schema: [
    "src/utils/userSchema.ts",
    "src/utils/budget.ts",
    "src/utils/transaction.ts",
  ],

  dbCredentials: {
    url: process.env.DATABASE_URL!,     
  },
});
