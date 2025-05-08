/**
 * src/utils/route.ts
 * ----------------------------------------------------------
 * Clerk‑aware helpers for server‑side route/handler files.
 */

import { auth } from "@clerk/nextjs/server";
import { db } from "./dbconfig";
import { users } from "./userSchema";
import { eq } from "drizzle-orm";

/** Return the DB user row for the current Clerk session, or null. */
export async function getDbUser() {
  const { userId: clerkId } = await auth();        // <-- await fixes TS 2339
  if (!clerkId) return null;

  const [user] = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.clerkId, clerkId))
    .limit(1);

  return user ?? null;
}

/**
 * Same as getDbUser but throws { status: 401 } if not signed in.
 * Handy for API RouteHandlers that need mandatory auth.
 */
export async function requireDbUser() {
  const user = await getDbUser();
  if (!user) {
    const err: any = new Error("Unauthorized");
    err.status = 401;
    throw err;
  }
  return user;
}
