import { auth } from "@clerk/nextjs/server";
import { Roles } from "@/app/_lib/types/globals";

export const checkRole = async (role: Roles) => {
  const { sessionClaims } = await auth();
  return sessionClaims?.metadata.role === role;
};
