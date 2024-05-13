"use server";

import { checkRole, handleError } from "@/lib/utils";
import { clerkClient, User } from "@clerk/nextjs/server";

export async function setRole(formData: FormData) {
  // Check that the user trying to set the role is an admin
  if (!checkRole("admin")) {
    handleError("Not Authorized");
  }

  try {
    const res: User = await clerkClient.users.updateUser(
      formData.get("id") as string,
      {
        publicMetadata: { role: formData.get("role") },
      },
    );
    return { message: res.publicMetadata };
  } catch (err) {
    return { message: err || "Unknown error" };
  }
}
