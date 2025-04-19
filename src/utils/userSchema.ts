import { AnyPgColumn } from "drizzle-orm/pg-core";
import { pgEnum, pgTable as table } from "drizzle-orm/pg-core";
import * as t from "drizzle-orm/pg-core";

export const rolesEnum = pgEnum("roles", ["guest", "user", "admin"]);

export const users = table(
  "users",
  {
    id: t.integer().primaryKey().generatedAlwaysAsIdentity(),
    firstName: t.varchar("first_name", { length: 256 }),
    lastName: t.varchar("last_name", { length: 256 }),
    email: t.varchar().notNull(),
    invitee: t.integer().references((): AnyPgColumn => users.id),
    role: rolesEnum().default("guest"),
  },
  (table) => [
    t.uniqueIndex("email_idx").on(table.email)
  ]
);


