// app/api/clerk/webhook/route.ts
import { NextRequest, NextResponse } from "next/server";
import { Webhook } from "svix";
import type { WebhookEvent } from "@clerk/backend";
import {eq} from "drizzle-orm";

import { db } from "./dbconfig";       // adjust paths to match your project
import { users } from "./userSchema";

const secret = process.env.CLERK_WEBHOOK_SECRET!;   // throws at boot if missing

export async function POST(req: NextRequest) {
  /* -----------------------------------------------------------
   * 1️⃣  Fetch raw body **before** doing anything else
   * --------------------------------------------------------- */
  const payload = await req.text();

  /* -----------------------------------------------------------
   * 2️⃣  Gather Svix signature headers and verify
   * --------------------------------------------------------- */
  const svixHeaders = {
    "svix-id":        req.headers.get("svix-id")        ?? "",
    "svix-timestamp": req.headers.get("svix-timestamp") ?? "",
    "svix-signature": req.headers.get("svix-signature") ?? "",
  };

  let evt: WebhookEvent;
  try {
    evt = new Webhook(secret).verify(payload, svixHeaders) as WebhookEvent;
  } catch {
    return new NextResponse("Invalid signature", { status: 400 });
  }

  /* -----------------------------------------------------------
   * 3️⃣  Handle the different Clerk events
   * --------------------------------------------------------- */
  const user = evt.data as any;        // tighten this if you want full typings

  switch (evt.type) {
    case "user.created":
    case "user.updated":
      await db
        .insert(users)
        .values({
          clerkId:   user.id,
          email:     user.email_addresses?.[0]?.email_address ?? "",
          firstName: user.first_name,
          lastName:  user.last_name,
        })
        .onConflictDoUpdate({
          target: users.clerkId,
          set: {
            email:     user.email_addresses?.[0]?.email_address ?? "",
            firstName: user.first_name,
            lastName:  user.last_name,
          },
        });
      break;

      case "user.deleted":
        await db
          .delete(users)
          .where(eq(users.clerkId, user.id));  // 👈 use eq(column, value)
        break;

    // (optional) default: ignore anything else
  }

  /* -----------------------------------------------------------
   * 4️⃣  Return 200 so Clerk stops retrying
   * --------------------------------------------------------- */
  return NextResponse.json({ ok: true });
}

/* (Optional) If you’re running on Vercel edge runtime:
export const config = { runtime: "edge" };
*/
