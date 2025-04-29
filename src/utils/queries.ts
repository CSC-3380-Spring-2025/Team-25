import { db } from "./dbconfig";
import { transactions } from "./transaction";
import { budgets } from "./budget";

import { sql, desc } from "drizzle-orm";

export async function getLeaderboard(limit = 5) {
  /* percent = abs(sum(amount)) / target_amount   (avoid /0) */
  const percentExpr = sql<number>`ABS(COALESCE(SUM(${transactions.amount}),0))::float
                                  / NULLIF(${budgets.targetAmount},0)`;

  return db
    .select({
      id: budgets.id,
      name: budgets.name,
      target: budgets.targetAmount,
      spent: sql<number>`ABS(COALESCE(SUM(${transactions.amount}),0))`.as("spent"),
      percent: percentExpr.as("percent"),
    })
    .from(budgets)
    .leftJoin(transactions, sql`${budgets.id} = ${transactions.budgetId}`)
    .groupBy(budgets.id)
    .orderBy(desc(percentExpr))
    .limit(limit);
}
