/* ---------------------------------------------------------------------
 *  DELETE /api/budgets/:id/transactions/:txId
 *  ---------------------------------------------------------------
 *  Caller must be a member of the budget.  Removes the row.
 * -------------------------------------------------------------------*/
import { db } from "@/utils/dbconfig";
import { budgetMembers } from "@/utils/budget";
import { transactions } from "@/utils/transaction";
import { getOrCreateMe } from "@/utils/getOrCreateMe";
import { eq, and } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string; txId: string } },
) {
  const me = await getOrCreateMe();
  if (!me) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const budgetId = Number(params.id);
  const txId = Number(params.txId);

  /* ACL check */
  const [mem] = await db
    .select()
    .from(budgetMembers)
    .where(and(eq(budgetMembers.budgetId, budgetId), eq(budgetMembers.userId, me.id)))
    .limit(1);

  if (!mem) return Response.json({ error: "Forbidden" }, { status: 403 });

  /* delete row (no 404 if already gone) */
  await db
    .delete(transactions)
    .where(and(eq(transactions.id, txId), eq(transactions.budgetId, budgetId)));

  return Response.json({ ok: true });
}
