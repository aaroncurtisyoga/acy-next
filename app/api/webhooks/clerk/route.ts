import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { WebhookEvent } from "@clerk/nextjs/server";
import { clerkClient } from "@clerk/nextjs/server";
import { Webhook } from "svix";
import prisma from "@/app/_lib/prisma";
import { handleError } from "@/app/_lib/utils";

export async function POST(req: Request) {
  // You can find this in the Clerk Dashboard -> Webhooks -> choose the webhooks
  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    handleError(
      "Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local",
    );
  }

  // Get the headers
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error occured -- no svix headers", {
      status: 400,
    });
  }

  // Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your secret.
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    handleError("Error verifying webhooks:", err);
    return new Response("Error occurred", {
      status: 400,
    });
  }

  // Get the type
  const eventType = evt.type;

  // Create a new user in database when a Clerk user is created
  if (eventType === "user.created") {
    const { id, email_addresses, image_url, first_name, last_name } = evt.data;
    const user = {
      clerkId: id!,
      email: email_addresses[0].email_address,
      firstName: first_name,
      lastName: last_name,
      photo: image_url,
    };
    try {
      const newUser = await prisma.user.create({ data: user });
      if (newUser) {
        await (
          await clerkClient()
        ).users.updateUserMetadata(id!, {
          publicMetadata: {
            userId: newUser.id,
          },
        });
        return NextResponse.json({ message: "OK", user: newUser });
      }
    } catch (error) {
      handleError("creating", error);
      return NextResponse.json({
        message: "Error creating user",
        error: error.message,
      });
    }
  }

  // Update user in database when a Clerk user is updated
  if (eventType === "user.updated") {
    const { id, image_url, first_name, last_name } = evt.data;
    try {
      const updatedUser = await prisma.user.update({
        where: { clerkId: id! },
        data: {
          firstName: first_name,
          lastName: last_name,
          photo: image_url,
        },
      });
      return NextResponse.json({ message: "OK", user: updatedUser });
    } catch (error) {
      handleError("updating", error);
      return NextResponse.json({
        message: "Error updating user",
        error: error.message,
      });
    }
  }

  // Delete user in database when a Clerk user is deleted
  if (eventType === "user.deleted") {
    const { id } = evt.data;
    try {
      const deletedUser = await prisma.user.delete({ where: { clerkId: id! } });
      return NextResponse.json({ message: "OK", user: deletedUser });
    } catch (error) {
      handleError("deleting", error);
      return NextResponse.json({
        message: "Error deleting user",
        error: error.message,
      });
    }
  }
}
