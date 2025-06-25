import { auth, clerkClient } from "@clerk/nextjs/server";
import { db } from "./dbconfig";
import { users } from "./userSchema";
import { eq } from "drizzle-orm";
export async function getOrCreateMe() {
    const { userId: clerkId } = await auth();

    // User is not authenticated.
    if (!clerkId) {
        return null;
    }

    // The `clerkClient` from Clerk should be an object, but it seems TypeScript
    // is incorrectly inferring it as a function: `() => Promise<ClerkClient>`.
    // To resolve this specific compilation error, we will call it as a function.
    const client = await clerkClient();

    if (!client.users) {
        console.error("Clerk client users API is not available. Check Clerk Secret Key configuration.");
        return null;
    }
    const clerkUser = await client.users.getUser(clerkId);

    const primaryEmail = clerkUser.emailAddresses.find(
        (e) => e.id === clerkUser.primaryEmailAddressId
    )?.emailAddress;

    if (!primaryEmail) {
        // This is an edge case, but a user should have a primary email.
        console.error(`User with clerkId ${clerkId} does not have a primary email.`);
        return null;
    }

    const [userRecord] = await db
        .insert(users)
        .values({
            clerkId,
            email: primaryEmail,
            firstName: clerkUser.firstName,
            lastName: clerkUser.lastName,
        })
        .onConflictDoUpdate({
            target: users.clerkId,
            set: {
                email: primaryEmail,
                firstName: clerkUser.firstName,
                lastName: clerkUser.lastName,
            },
        })
        .returning();
    return userRecord;
}
