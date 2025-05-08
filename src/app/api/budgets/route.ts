import { getOrCreateMe } from "@/utils/getOrCreateMe";
import { db } from "@/utils/dbconfig";
import { budgets, budgetMembers } from "@/utils/budget";
import { transactions } from "@/utils/transaction";
import { eq, sql } from "drizzle-orm";

/* ------------------------------------------------------------------ */
/* GET  /api/budgets  – list budgets I can view, with usage numbers   */
/* ------------------------------------------------------------------ */
export async function GET() {
  const me = await getOrCreateMe();
  if (!me) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  /* one row per budget where I’m a member */
  const rows = await db
    .select({
      id: budgets.id,
      name: budgets.name,
      targetAmount: budgets.targetAmount,
      spent: sql<number>`coalesce(sum(${transactions.amount}), 0)`.as("spent"),
      members: sql<number[]>`array_agg(${budgetMembers.userId})`.as("members"),
    })
    .from(budgets)
    /* ACL: I must appear in budget_members */
    .innerJoin(
      budgetMembers,
      eq(budgetMembers.budgetId, budgets.id),
    )
    /* join transactions to aggregate spent (may be null) */
    .leftJoin(
      transactions,
      eq(transactions.budgetId, budgets.id),
    )
    .where(eq(budgetMembers.userId, me.id))
    .groupBy(budgets.id);

  return Response.json(rows);
}

/* ------------------------------------------------------------------ */
/* POST  /api/budgets  – create a new budget (no explicit transaction)*/
/* ------------------------------------------------------------------ */
export async function POST(req: Request) {
  const me = await getOrCreateMe();
  if (!me) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { name, target } = (await req.json()) as {
    name: string;
    target: number;
  };

  if (!name || !target || target <= 0) {
    return Response.json({ error: "Invalid body" }, { status: 400 });
  }

  /* 1. create budget */
  const [b] = await db
    .insert(budgets)
    .values({ name, targetAmount: target, ownerId: me.id })
    .returning({ id: budgets.id });

  /* 2. grant caller owner role */
  await db.insert(budgetMembers).values({
    budgetId: b.id,
    userId: me.id,
    role: "owner",
  });

  return Response.json({ id: b.id }, { status: 201 });
}
