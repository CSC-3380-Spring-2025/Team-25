import { db } from "@/utils/dbconfig";
import {transactions } from "@/utils/transaction";
import { budgets } from "@/utils/budget";
import { sql, desc, eq } from "drizzle-orm";

/*  GET /api/leaderboard
 *  --------------------------------------------------------------
 *  Returns the top 10 budgets in the entire database,
 *  ordered by total dollars spent (highest first).
 *  -------------------------------------------------------------- */
export async function GET() {
  /* one row per budget with total spent */
  const rows = await db
    .select({
      id: budgets.id,
      name: budgets.name,
      spent: sql<number>`coalesce(sum(${transactions.amount}),0)`.as("spent"),
    })
    .from(budgets)
    .leftJoin(
      transactions,
      eq(transactions.budgetId, budgets.id),
    )
    .groupBy(budgets.id)
    .orderBy(desc(sql`spent`))
    .limit(10); // change to 5 if you only want 5 rows

  return Response.json(rows);
}
