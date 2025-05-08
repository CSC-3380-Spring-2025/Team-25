import { db } from "./dbconfig";
import { budgets, budgetMembers } from "./budget";
import { transactions } from "./transaction";
import { sql, eq, desc } from "drizzle-orm";

/** Top‑N progress leaderboard restricted to one user (owner or shared). */
export async function getLeaderboardForUser(userId: number, limit = 5) {
  const pct = sql<number>`ABS(COALESCE(SUM(${transactions.amount}),0))::float
                          / NULLIF(${budgets.targetAmount},0)`;

  return db
    .select({
      id:      budgets.id,
      name:    budgets.name,
      target:  budgets.targetAmount,
      spent:   sql<number>`ABS(COALESCE(SUM(${transactions.amount}),0))`.as("spent"),
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
