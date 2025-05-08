/**
 * Ensures there's a row in `users` that matches the signed‑in Clerk user.
 * Returns that row, or null when no session is present.
 */
import { auth, clerkClient } from "@clerk/nextjs/server";
import { db } from "./dbconfig";
import { users } from "./userSchema";
import { eq } from "drizzle-orm";

export async function getOrCreateMe() {
  /* 1 ── Session ---------------------------------------------------- */
  const { userId: clerkId } = await auth();
  if (!clerkId) return null;                       // unauthenticated

  /* 2 ── Already in DB? -------------------------------------------- */
  const [row] = await db
    .select()
    .from(users)
    .where(eq(users.clerkId, clerkId))
    .limit(1);

  if (row) return row;

  /* 3 ── Ask Clerk for profile ------------------------------------- */
  const client     = await clerkClient();          // first await the fn
  const clerkUser  = await client.users.getUser(clerkId);

  /* 4 ── Insert new row -------------------------------------------- */
  const [created] = await db
    .insert(users)
    .values({
      clerkId,
      email: clerkUser.emailAddresses?.[0]?.emailAddress ?? "",
      firstName: clerkUser.firstName ?? null,
      lastName:  clerkUser.lastName  ?? null,
    })
    .returning();

  return created;
}
