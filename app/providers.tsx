"use client";

import { useRouter } from "next/navigation";
import { ClerkProvider } from "@clerk/nextjs";
import { NextUIProvider } from "@nextui-org/react";
import { StoreProvider } from "@/app/StoreProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  return (
    <StoreProvider>
      <ClerkProvider>
        <NextUIProvider navigate={router.push}>{children}</NextUIProvider>
      </ClerkProvider>
    </StoreProvider>
  );
}
