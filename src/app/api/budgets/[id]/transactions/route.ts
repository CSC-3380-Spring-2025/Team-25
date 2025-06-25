import { db } from "@/utils/dbconfig";
import { budgetMembers } from "@/utils/budget";
import { transactions } from "@/utils/transaction";
import { getOrCreateMe } from "@/utils/getOrCreateMe";
import { eq, and, desc, sql } from "drizzle-orm";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

async function checkMembership(userId: number, budgetId: number) {
  const [membership] = await db
    .select({ id: budgetMembers.id })
    .from(budgetMembers)
    .where(and(eq(budgetMembers.budgetId, budgetId), eq(budgetMembers.userId, userId)));
  return !!membership;
}

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const me = await getOrCreateMe();
  if (!me) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const budgetId = Number(params.id);
  if (isNaN(budgetId)) {
    return NextResponse.json({ error: "Invalid budget ID" }, { status: 400 });
  }

  if (!(await checkMembership(me.id, budgetId))) {
    return NextResponse.json(
      { error: "Forbidden: You are not a member of this budget." },
      { status: 403 }
    );
  }

  const rows = await db
    .select({
      id: transactions.id,
      budgetId: transactions.budgetId,
      amount: sql<number>`${transactions.amount} / 100.0`.as("amount"),
      description: transactions.description,
      createdAt: transactions.createdAt,
    })
    .from(transactions)
    .where(eq(transactions.budgetId, budgetId))
    .orderBy(desc(transactions.createdAt));

  return NextResponse.json(rows);
}
export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const me = await getOrCreateMe();
    if (!me) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const budgetId = Number(params.id);
    if (isNaN(budgetId)) {
      return NextResponse.json({ error: "Invalid budget ID" }, { status: 400 });
    }

    if (!(await checkMembership(me.id, budgetId))) {
      return NextResponse.json(
        { error: "Forbidden: You are not a member of this budget." },
        { status: 403 }
      );
    }

    const body = await req.json();

    if (typeof body.amount !== "number" || body.amount === 0) {
      return NextResponse.json({ error: "Amount must be a non-zero number." }, { status: 400 });
    }
    if (body.description && typeof body.description !== "string") {
      return NextResponse.json({ error: "Description must be a string." }, { status: 400 });
    }

    const amountInCents = Math.round(body.amount * 100);

    const [newTransaction] = await db
      .insert(transactions)
      .values({
        budgetId: budgetId,
        amount: amountInCents,
        description: body.description ?? null,
      })
      .returning();

    return NextResponse.json(newTransaction, { status: 201 });
  } catch (error: unknown) {
    console.error("Error creating transaction:", error);
    return NextResponse.json(
      {
        error: "Internal Server Error: Could not create transaction.",
        details: (error as Error).message,
      },
      { status: 500 }
    );
  }
}