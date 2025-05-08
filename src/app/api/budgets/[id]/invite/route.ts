import { auth } from "@clerk/nextjs/server";
import { db } from "@/utils/dbconfig";
import { users } from "@/utils/userSchema";
import { budgetMembers, budgetInvites } from "@/utils/budget";
import { eq, and } from "drizzle-orm";

export async function POST(
  req: Request,
  { params }: { params: { id: string } },
) {
  const { userId: clerkId } = await auth();
  if (!clerkId) return new Response("Unauthorized", { status: 401 });

  const { inviteeId, role = "viewer" } = await req.json() as {
    inviteeId: number;
    role?: "viewer" | "editor";
  };

  /* caller → DB user */
  const [caller] = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.clerkId, clerkId))
    .limit(1);

  if (!caller) return new Response("Caller not found", { status: 404 });

  /* caller must be owner/editor for that budget */
  const [membership] = await db
    .select({ role: budgetMembers.role })
    .from(budgetMembers)
    .where(
      and(
        eq(budgetMembers.budgetId, +params.id),
        eq(budgetMembers.userId, caller.id),
      ),
    )
    .limit(1);

  if (!membership || (membership.role !== "owner" && membership.role !== "editor"))
    return new Response("Forbidden", { status: 403 });

  await db
    .insert(budgetInvites)
    .values({
      budgetId: +params.id,
      inviterUserId: caller.id,
      inviteeUserId: inviteeId,
      role,
    })
    .onConflictDoNothing();

  return Response.json({ ok: true });
}
