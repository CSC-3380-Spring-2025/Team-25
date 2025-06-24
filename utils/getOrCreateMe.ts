
// Import auth and clerkClient from Clerk's Next.js server utilities
import { auth, clerkClient } from "@clerk/nextjs/server";
import { db } from "./dbconfig"; // Assuming this path is correct for your Drizzle config
import { users } from "./userSchema"; // Assuming this path is correct for your user schema
import { eq, sql } from "drizzle-orm"; // eq and sql are Drizzle-ORM functions

export async function getOrCreateMe() {
     const { userId: clerkId } = await auth();

    // If no clerkId is available, it means no authenticated user, so return null.
    if (!clerkId) {
        return null; // No clerkId means no authenticated user
    }
 

    // Try to find the user first
    const [existingUser] = await db
        .select()
        .from(users)
        .where(eq(users.clerkId, clerkId))
        .limit(1);

    if (existingUser) {
        return existingUser;
    }

    // If user does not exist, create it
    const clerkUser = await clerkClient.users.getUser(clerkId);
 
    const [userRecord] = await db
         .insert(users)
         .values({
             clerkId,
             email: clerkUser.emailAddresses?.[0]?.emailAddress ?? "",
             firstName: clerkUser.firstName ?? null,
             lastName: clerkUser.lastName ?? null
         })
         .onConflictDoUpdate({
             target: users.email, // Specify the column that has the unique constraint
             set: { clerkId: clerkId, firstName: clerkUser.firstName ?? null, lastName: clerkUser.lastName ?? null, email: clerkUser.emailAddresses?.[0]?.emailAddress ?? "" },
             where: sql`${users.clerkId} IS DISTINCT FROM ${clerkId}`, // Only update if the existing clerkId is different
         })
         .returning(); // Return the inserted or updated record
 

     return userRecord;
 }
