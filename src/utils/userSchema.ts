import { pgTable as table, pgEnum } from "drizzle-orm/pg-core";
import * as t from "drizzle-orm/pg-core";

export const rolesEnum = pgEnum("roles", ["guest", "user", "admin"]);

export const users = table(
  "users",
  {
    id: t.integer().primaryKey().generatedAlwaysAsIdentity(),
    clerkId: t.varchar("clerk_id", { length: 191 }).unique().notNull(),
    firstName: t.varchar("first_name", { length: 256 }),
    lastName: t.varchar("last_name", { length: 256 }),
    email: t.varchar().notNull(),
    role: rolesEnum().default("user"),
    createdAt: t.timestamp("created_at").defaultNow(),
  },
  (tbl) => [ t.unique('users_clerk_id_unique').on(tbl.clerkId),    // exact constraint
    t.uniqueIndex('email_idx').on(tbl.email),
 ]
);