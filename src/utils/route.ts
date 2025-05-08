

import { auth } from "@clerk/nextjs/server";
import { db } from "./dbconfig";
import { users } from "./userSchema";
import { eq } from "drizzle-orm";

export async function getDbUser() {
  const { userId: clerkId } = await auth();       
  if (!clerkId) return null;

  const [user] = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.clerkId, clerkId))
    .limit(1);

  return user ?? null;
}


export async function requireDbUser() {
  const user = await getDbUser();
  if (!user) {
    const err: any = new Error("Unauthorized");
    err.status = 401;
    throw err;
  }
  return user;
}
