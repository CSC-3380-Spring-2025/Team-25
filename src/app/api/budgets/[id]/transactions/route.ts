import { db } from "@/utils/dbconfig";
import { transactions } from "@/utils/transaction";
import { budgetMembers } from "@/utils/budget";
import { getOrCreateMe } from "@/utils/getOrCreateMe";
import { eq, and, desc } from "drizzle-orm";

/* ---------------- GET /api/budgets/[id]/transactions ---------------- */
export async function GET(
  _req: Request,
  { params }: { params: { id: string } },
) {
  const me = await getOrCreateMe();
  if (!me) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  /* caller must be a member of the budget */
  const [mem] = await db
    .select()
    .from(budgetMembers)
    .where(
      and(eq(budgetMembers.budgetId, +params.id), eq(budgetMembers.userId, me.id)),
    )
    .limit(1);

  if (!mem) {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  const rows = await db
    .select()
    .from(transactions)
    .where(eq(transactions.budgetId, +params.id))
    .orderBy(desc(transactions.createdAt));        // ← fix

  return Response.json(rows);
}

/* ---------------- POST /api/budgets/[id]/transactions --------------- */
export async function POST(
  req: Request,
  { params }: { params: { id: string } },
) {
  const me = await getOrCreateMe();
  if (!me) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  if (!body.amount) {
    return Response.json({ error: "Missing amount" }, { status: 400 });
  }

  /* permission check */
  const [mem] = await db
    .select()
    .from(budgetMembers)
    .where(
      and(eq(budgetMembers.budgetId, +params.id), eq(budgetMembers.userId, me.id)),
    )
    .limit(1);

  if (!mem) {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  await db.insert(transactions).values({
    budgetId: +params.id,
    amount: body.amount,
    description: body.description ?? null,
  });

  return Response.json({ ok: true }, { status: 201 });
}
