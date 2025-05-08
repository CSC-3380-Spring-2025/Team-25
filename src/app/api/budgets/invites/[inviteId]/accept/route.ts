import { auth } from "@clerk/nextjs/server";
import { db } from "@/utils/dbconfig";
import { users } from "@/utils/userSchema";
import { budgetInvites, budgetMembers } from "@/utils/budget";
import { eq, and } from "drizzle-orm";

export async function POST(
  _req: Request,
  { params }: { params: { inviteId: string } },
) {
  const { userId: clerkId } = await auth();
  if (!clerkId) return new Response("Unauthorized", { status: 401 });

  /* me → DB user */
  const [me] = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.clerkId, clerkId))
    .limit(1);

  if (!me) return new Response("User not found", { status: 404 });

  /* pending invite addressed to me? */
  const [invite] = await db
    .select()
    .from(budgetInvites)
    .where(
      and(
        eq(budgetInvites.id,        +params.inviteId),
        eq(budgetInvites.inviteeUserId, me.id),
        eq(budgetInvites.status,    "pending"),
      ),
    )
    .limit(1);

  if (!invite) return new Response("Invite not found", { status: 404 });

  await db.transaction(async (tx) => {
    await tx
      .update(budgetInvites)
      .set({ status: "accepted" })
      .where(eq(budgetInvites.id, invite.id));

    await tx
      .insert(budgetMembers)
      .values({
        budgetId: invite.budgetId,
        userId:   me.id,
        role:     invite.role,
      })
      .onConflictDoNothing();
  });

  return Response.json({ ok: true });
}
