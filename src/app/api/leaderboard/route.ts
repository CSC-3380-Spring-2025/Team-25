import { db } from "@/utils/dbconfig";
import {transactions } from "@/utils/transaction";
import { budgets } from "@/utils/budget";
import { sql, desc, eq } from "drizzle-orm";


export async function GET() {
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
    .limit(10); 

  return Response.json(rows);
}
