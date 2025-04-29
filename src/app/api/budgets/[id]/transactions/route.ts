import { NextResponse } from "next/server";
import { db } from "@/utils/dbconfig";
import { transactions } from "@/utils/transaction";
import { budgets} from "@/utils/budget";
import { eq, desc } from "drizzle-orm";

export const runtime = "nodejs"; // change to "nodejs" if you need Node APIs

/* GET /api/budgets/:id/transactions  → history */
export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const id = Number(params.id);
  const rows = await db
    .select()
    .from(transactions)
    .where(eq(transactions.budgetId, id))
    .orderBy(desc(transactions.createdAt));
  return NextResponse.json(rows);
}

/* POST /api/budgets/:id/transactions  → add income/expense
   Body: { amount:number, category?:string, note?:string }          */
export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const budgetId = Number(params.id);
  const { amount, category, note } = await req.json();

  if (isNaN(amount) || !amount)
    return NextResponse.json({ error: "amount required" }, { status: 400 });

  const [row] = await db
    .insert(transactions)
    .values({ budgetId, amount, category, note })
    .returning();
  return NextResponse.json(row, { status: 201 });
}
