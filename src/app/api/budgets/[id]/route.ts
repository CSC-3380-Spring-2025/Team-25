import { db } from "@/utils/dbconfig";
import { budgets, budgetMembers } from "@/utils/budget";
import { transactions } from "@/utils/transaction";
import { getOrCreateMe } from "@/utils/getOrCreateMe";
import { eq, and, sql } from "drizzle-orm";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const me = await getOrCreateMe();
  if (!me) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const budgetId = Number(params.id);
  if (isNaN(budgetId)) {
    return NextResponse.json({ error: "Invalid budget ID" }, { status: 400 });
  }

  const [membership] = await db
    .select({ id: budgetMembers.id })
    .from(budgetMembers)
    .where(and(eq(budgetMembers.budgetId, budgetId), eq(budgetMembers.userId, me.id)));

  if (!membership) {
    return NextResponse.json(
      { error: "Forbidden: You are not a member of this budget." },
      { status: 403 }
    );
  }

  const [row] = await db
    .select({
      id: budgets.id,
      name: budgets.name,
      targetAmount: sql<number>`${budgets.targetAmount} / 100.0`.as("targetAmount"),
      spent: sql<number>`COALESCE(SUM(${transactions.amount}), 0) / 100.0`.as("spent"),
      ownerId: budgets.ownerId,
      createdAt: budgets.createdAt,
    })
    .from(budgets)
    .leftJoin(transactions, eq(transactions.budgetId, budgets.id))
    .where(eq(budgets.id, budgetId))
    .groupBy(budgets.id);

  if (!row) {
    return NextResponse.json({ error: "Budget not found" }, { status: 404 });
  }

  return NextResponse.json(row);
}
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const me = await getOrCreateMe();
    if (!me) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const budgetId = Number(params.id);
    if (isNaN(budgetId)) {
      return NextResponse.json({ error: "Invalid budget ID" }, { status: 400 });
    }

    const [budget] = await db
      .select({ ownerId: budgets.ownerId })
      .from(budgets)
      .where(eq(budgets.id, budgetId));

    if (!budget) {
      return NextResponse.json({ error: "Budget not found" }, { status: 404 });
    }

    if (budget.ownerId !== me.id) {
      return NextResponse.json({ error: "Forbidden: Only the owner can delete this budget." }, { status: 403 });
    }

    await db.delete(budgets).where(eq(budgets.id, budgetId));

    return NextResponse.json({ message: "Budget deleted successfully" }, { status: 200 });
  } catch (error: unknown) {
    return NextResponse.json({ error: "Internal Server Error", details: (error as Error).message }, { status: 500 });
  }
}