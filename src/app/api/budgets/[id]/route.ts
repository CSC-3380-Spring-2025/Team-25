import { db } from "@/utils/dbconfig";
import { budgets, budgetMembers } from "@/utils/budget";
import { transactions } from "@/utils/transaction";
import { getOrCreateMe } from "@/utils/getOrCreateMe";
import { eq, and, sql } from "drizzle-orm";

export const dynamic = "force-dynamic";

/* GET /api/budgets/:id – single budget with spent total */
export async function GET(
  _req: Request,
  { params }: { params: { id: string } },
) {
  const me = await getOrCreateMe();
  if (!me) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const budgetId = Number(params.id);

  /* must be a member */
  const [row] = await db
    .select({
      id: budgets.id,
      name: budgets.name,
      targetAmount: budgets.targetAmount,
      spent: sql<number>`coalesce(sum(${transactions.amount}),0)`.as("spent"),
    })
    .from(budgets)
    .innerJoin(
      budgetMembers,
      and(
        eq(budgetMembers.budgetId, budgets.id),
        eq(budgetMembers.userId, me.id),
      ),
    )
    .leftJoin(
      transactions,
      eq(transactions.budgetId, budgets.id),
    )
    .where(eq(budgets.id, budgetId))
    .groupBy(budgets.id);

  if (!row) return Response.json({ error: "Not found" }, { status: 404 });

  return Response.json(row);
}
export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } },
) {
  const me = await getOrCreateMe();
  if (!me) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const budgetId = Number(params.id);

  /* User must be owner of that budget */
  const [ownerRow] = await db
    .select()
    .from(budgets)
    .where(and(eq(budgets.id, budgetId), eq(budgets.ownerId, me.id)))
    .limit(1);

  if (!ownerRow) {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  /* Cascade delete: transactions → members → budget */
  await db.delete(transactions).where(eq(transactions.budgetId, budgetId));
  await db.delete(budgetMembers).where(eq(budgetMembers.budgetId, budgetId));
  await db.delete(budgets).where(eq(budgets.id, budgetId));

  return Response.json({ ok: true });
}