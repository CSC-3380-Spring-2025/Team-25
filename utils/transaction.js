"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transactions = void 0;
var pg_core_1 = require("drizzle-orm/pg-core");
var t = require("drizzle-orm/pg-core");
var budget_1 = require("./budget");
exports.transactions = (0, pg_core_1.pgTable)("transactions", {
    id: t.integer().primaryKey().generatedAlwaysAsIdentity(),
    budgetId: t.integer("budget_id")
        .references(function () { return budget_1.budgets.id; }, { onDelete: "cascade" })
        .notNull(),
    amount: t.integer("amount").notNull(), // negative = spend
    description: t.varchar("description", { length: 512 }),
    createdAt: t.timestamp("created_at").defaultNow(),
});
