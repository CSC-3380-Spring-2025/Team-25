/* Defines ONLY the `users` table – no imports from ./budget */
import { pgTable as table, pgEnum } from "drizzle-orm/pg-core";
import * as t from "drizzle-orm/pg-core";

/* enums */
export const rolesEnum = pgEnum("roles", ["guest", "user", "admin"]);

/* users */
export const users = table(
  "users",
  {
    id:        t.integer().primaryKey().generatedAlwaysAsIdentity(),
    clerkId:   t.varchar("clerk_id", { length: 128 }).notNull(),
    firstName: t.varchar("first_name", { length: 256 }),
    lastName:  t.varchar("last_name", { length: 256 }),
    email:     t.varchar("email", { length: 256 }).notNull(),
    role:      rolesEnum("role").default("user"),
    createdAt: t.timestamp("created_at").defaultNow(),
  },
  (tbl) => [
    t.uniqueIndex("email_idx").on(tbl.email),
    t.uniqueIndex("clerk_idx").on(tbl.clerkId),
  ],
);
