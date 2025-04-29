// src/app/api/budgets/[id]/route.ts
import { NextResponse } from "next/server";
import { db } from "@/utils/dbconfig";
import { budgets } from "@/utils/budget";
import { eq } from "drizzle-orm";           // ← NEW

export const runtime = "nodejs";              // or "nodejs"

/* GET /api/budgets/:id */
export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const id = Number(params.id);
  const [row] = await db
    .select()
    .from(budgets)
    .where(eq(budgets.id, id));

  return row
    ? NextResponse.json(row)
    : NextResponse.json({ error: "Not found" }, { status: 404 });
}

/* DELETE /api/budgets/:id */
export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const id = Number(params.id);
  await db.delete(budgets).where(eq(budgets.id, id));
  return NextResponse.json({ ok: true }, { status: 204 });
}
