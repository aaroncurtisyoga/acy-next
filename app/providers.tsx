"use client";

import { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { ClerkProvider, useUser } from "@clerk/nextjs";
import { HeroUIProvider } from "@heroui/system";
import { StoreProvider } from "@/app/StoreProvider";

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  const router = useRouter();

  return (
    <StoreProvider>
      <ClerkProvider>
        <HeroUIProvider navigate={router.push}>{children}</HeroUIProvider>
      </ClerkProvider>
    </StoreProvider>
  );
}
