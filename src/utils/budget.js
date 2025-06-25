"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.budgetInvites = exports.budgetMembers = exports.budgets = exports.inviteStatusEnum = exports.budgetRoleEnum = void 0;
var pg_core_1 = require("drizzle-orm/pg-core");
var t = require("drizzle-orm/pg-core");
var drizzle_orm_1 = require("drizzle-orm");
var userSchema_1 = require("./userSchema");
exports.budgetRoleEnum = (0, pg_core_1.pgEnum)("budget_role", ["owner", "editor", "viewer"]);
exports.inviteStatusEnum = (0, pg_core_1.pgEnum)("invite_status", ["pending", "accepted", "declined"]);
exports.budgets = (0, pg_core_1.pgTable)("budgets", {
    id: t.integer().primaryKey().generatedAlwaysAsIdentity(),
    name: t.varchar("name", { length: 256 }).notNull(),
    targetAmount: t.integer("target_amount").notNull(),
    ownerId: t.integer("owner_id")
        .references(function () { return userSchema_1.users.id; }, { onDelete: "cascade" })
        .notNull(),
    createdAt: t.timestamp("created_at").defaultNow(),
});
exports.budgetMembers = (0, pg_core_1.pgTable)("budget_members", {
    id: t.integer().primaryKey().generatedAlwaysAsIdentity(),
    budgetId: t.integer("budget_id")
        .references(function () { return exports.budgets.id; }, { onDelete: "cascade" })
        .notNull(),
    userId: t.integer("user_id")
        .references(function () { return userSchema_1.users.id; }, { onDelete: "cascade" })
        .notNull(),
    role: (0, exports.budgetRoleEnum)("role").default("viewer"),
}, function (tbl) { return [
    t.uniqueIndex("budget_member_unique").on(tbl.budgetId, tbl.userId),
]; });
exports.budgetInvites = (0, pg_core_1.pgTable)("budget_invites", {
    id: t.integer().primaryKey().generatedAlwaysAsIdentity(),
    budgetId: t.integer("budget_id")
        .references(function () { return exports.budgets.id; }, { onDelete: "cascade" })
        .notNull(),
    inviterUserId: t.integer("inviter_user_id")
        .references(function () { return userSchema_1.users.id; }, { onDelete: "cascade" })
        .notNull(),
    inviteeUserId: t.integer("invitee_user_id")
        .references(function () { return userSchema_1.users.id; }, { onDelete: "cascade" })
        .notNull(),
    role: (0, exports.budgetRoleEnum)("role").default("viewer"),
    status: (0, exports.inviteStatusEnum)("status").default("pending"),
    createdAt: t.timestamp("created_at").defaultNow(),
}, function (tbl) { return [
    t.uniqueIndex("invite_unique")
        .on(tbl.budgetId, tbl.inviteeUserId)
        .where((0, drizzle_orm_1.sql)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["", " = 'pending'"], ["", " = 'pending'"])), tbl.status)),
]; });
var templateObject_1;
