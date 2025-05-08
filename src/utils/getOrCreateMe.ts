
import { auth, clerkClient } from "@clerk/nextjs/server";
import { db } from "./dbconfig";
import { users } from "./userSchema";
import { eq } from "drizzle-orm";

export async function getOrCreateMe() {
  const { userId: clerkId } = await auth();
  if (!clerkId) return null;                       // unauthenticated

  const [row] = await db
    .select()
    .from(users)
    .where(eq(users.clerkId, clerkId))
    .limit(1);

  if (row) return row;

  const client     = await clerkClient();          // first await the fn
  const clerkUser  = await client.users.getUser(clerkId);

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
