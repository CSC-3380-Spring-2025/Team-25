import { db } from "@/utils/dbconfig";
import { budgets, budgetMembers } from "@/utils/budget";
import { transactions } from "@/utils/transaction";
import { getOrCreateMe } from "@/utils/getOrCreateMe";
import { eq, sql, desc } from "drizzle-orm";
import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";
export async function GET() {
    const me = await getOrCreateMe();
    if (!me) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

  const rows = await db
    .select({
      id: budgets.id,
      name: budgets.name,
      targetAmount: sql<number>`${budgets.targetAmount} / 100.0`.as("targetAmount"),
      spent: sql<number>`coalesce(sum(${transactions.amount}), 0) / 100.0`.as("spent"),
      members: sql<number>`count(${budgetMembers.userId})`.as("members"),
    })
    .from(budgets)
    .leftJoin(budgetMembers, eq(budgetMembers.budgetId, budgets.id))
    .leftJoin(transactions, eq(transactions.budgetId, budgets.id))
    .where(
      // User must be a member of the budget to see it
      sql`${budgets.id} IN (SELECT budget_id FROM budget_members WHERE user_id = ${me.id})`,
    )
    .groupBy(budgets.id)
    .orderBy(desc(budgets.createdAt));

    return NextResponse.json(rows);
}

export async function POST(req: Request) {
    try {
        const me = await getOrCreateMe();
        if (!me) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { name, target } = await req.json();

        if (!name || typeof name !== 'string' || name.trim() === '') {
            return NextResponse.json({ error: "Budget name is required and must be a non-empty string." }, { status: 400 });
        }

        const targetAmountFloat = Number(target);
        if (isNaN(targetAmountFloat) || targetAmountFloat <= 0) {
            return NextResponse.json({ error: "Target amount is required and must be a positive number." }, { status: 400 });
        }

        const targetAmountInCents = Math.round(targetAmountFloat * 100);

        const [newBudget] = await db
            .insert(budgets)
            .values({ name: name.trim(), targetAmount: targetAmountInCents, ownerId: me.id })
            .returning();

        await db.insert(budgetMembers).values({
            budgetId: newBudget.id,
            userId: me.id,
            role: 'owner', // Assign 'owner' role to the creator
        }).execute();

        return NextResponse.json(newBudget, { status: 201 });
    } catch (error: unknown) {
        console.error("Error creating budget:", error);
        return NextResponse.json({ error: "Internal Server Error: Could not create budget.", details: (error as Error).message }, { status: 500 });
    }
}