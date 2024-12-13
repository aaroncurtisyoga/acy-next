"use client";

import { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { ClerkProvider, useUser } from "@clerk/nextjs";
import { NextUIProvider } from "@nextui-org/react";
import { StoreProvider } from "@/app/StoreProvider";

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  const router = useRouter();

  return (
    <StoreProvider>
      <ClerkProvider>
        <NextUIProvider navigate={router.push}>{children}</NextUIProvider>
      </ClerkProvider>
    </StoreProvider>
  );
}
