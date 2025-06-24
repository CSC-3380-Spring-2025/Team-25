"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.users = exports.rolesEnum = void 0;
var pg_core_1 = require("drizzle-orm/pg-core");
var t = require("drizzle-orm/pg-core");
/* enums */
exports.rolesEnum = (0, pg_core_1.pgEnum)("roles", ["guest", "user", "admin"]);
/* users */
exports.users = (0, pg_core_1.pgTable)("users", {
    id: t.integer().primaryKey().generatedAlwaysAsIdentity(),
    clerkId: t.varchar("clerk_id", { length: 128 }).notNull(),
    firstName: t.varchar("first_name", { length: 256 }),
    lastName: t.varchar("last_name", { length: 256 }),
    email: t.varchar("email", { length: 256 }).notNull(),
    role: (0, exports.rolesEnum)("role").default("user"),
    createdAt: t.timestamp("created_at").defaultNow(),
}, function (tbl) { return [
    t.uniqueIndex("email_idx").on(tbl.email),
    t.uniqueIndex("clerk_idx").on(tbl.clerkId),
]; });
