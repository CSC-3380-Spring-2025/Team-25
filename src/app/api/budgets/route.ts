// RSC / App Router, Edge-friendly
import { NextResponse } from "next/server";
import { db } from "@/utils/dbconfig";
import { budgets } from "@/utils/budget";        // your drizzle table

export const runtime = "nodejs";                  // or remove to run in Node

export async function GET() {
  const rows = await db.select().from(budgets);
  return NextResponse.json(rows);
}

export async function POST(req: Request) {
  const { name, targetAmount, ownerId } = await req.json();
  const [row] = await db.insert(budgets)
    .values({ name, targetAmount, ownerId })    // ownerId must exist in `users`
    .returning();
  return NextResponse.json(row, { status: 201 });
}
