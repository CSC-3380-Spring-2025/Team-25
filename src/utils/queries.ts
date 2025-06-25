import { db } from "./dbconfig";
import { budgets, budgetMembers } from "./budget";
import { transactions } from "./transaction";
import { sql, eq, desc } from "drizzle-orm";

export async function getLeaderboardForUser(userId: number, limit = 5) {
  const pct = sql<number>`ABS(COALESCE(SUM(${transactions.amount}),0))::float
                          / NULLIF(${budgets.targetAmount},0)`;

  return db
    .select({
      id:      budgets.id,
      name:    budgets.name,
      // Convert from cents to dollars/euros for API response
      target:  sql<number>`${budgets.targetAmount} / 100.0`.as("target"),
      spent:   sql<number>`ABS(COALESCE(SUM(${transactions.amount}),0)) / 100.0`.as("spent"),
      percent: pct.as("percent"),
    })
    .from(budgets)
    .innerJoin(budgetMembers, eq(budgetMembers.budgetId, budgets.id))
    .where(eq(budgetMembers.userId, userId))
    .leftJoin(transactions, eq(transactions.budgetId, budgets.id))
    .groupBy(budgets.id)
    .orderBy(desc(pct))
    .limit(limit);
}
