import { auth } from "@clerk/nextjs/server";
import { Roles } from "@/app/_lib/types/globals";

export const checkRole = (role: Roles) => {
  const { sessionClaims } = auth();
  return sessionClaims?.metadata.role === role;
};
