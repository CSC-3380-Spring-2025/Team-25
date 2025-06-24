import { pgTable as table } from "drizzle-orm/pg-core";
import * as t from "drizzle-orm/pg-core";
import { budgets } from "./budget";

export const transactions = table("transactions", {
  id:        t.integer().primaryKey().generatedAlwaysAsIdentity(),
  budgetId:  t.integer("budget_id")
              .references(() => budgets.id, { onDelete: "cascade" })
              .notNull(),
  amount:    t.integer("amount").notNull(),          // negative = spend
  description: t.varchar("description", { length: 512 }),
  createdAt: t.timestamp("created_at").defaultNow(),
});
