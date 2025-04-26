import { pgTable as table, pgEnum } from "drizzle-orm/pg-core";
import * as t from "drizzle-orm/pg-core";
import { users } from "./userSchema";

export const budgetRoleEnum = pgEnum("budget_role", ["owner", "editor", "viewer"]);

export const budgets = table("budgets", {
  id: t.integer().primaryKey().generatedAlwaysAsIdentity(),
  name: t.varchar("name", { length: 256 }).notNull(),
  targetAmount: t.integer("target_amount").notNull(),
  ownerId: t
    .integer("owner_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  createdAt: t.timestamp("created_at").defaultNow(),
});

export const budgetMembers = table(
  "budget_members",
  {
    id: t.integer().primaryKey().generatedAlwaysAsIdentity(),
    budgetId: t
      .integer("budget_id")
      .references(() => budgets.id, { onDelete: "cascade" })
      .notNull(),
    userId: t
      .integer("user_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    role: budgetRoleEnum("role").default("viewer"),
  },
  (tbl) => [t.uniqueIndex("budget_member_unique").on(tbl.budgetId, tbl.userId)]
);
