// Next.js 15 "route.ts" (Edge compatible)
import { NextResponse } from "next/server";
import { getLeaderboard } from "@/utils/queries";

export const runtime = "nodejs";               // works great with Neon HTTP

export async function GET() {
  const rows = await getLeaderboard(5);
  return NextResponse.json(rows);
}
