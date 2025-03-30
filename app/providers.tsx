"use client";

import { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { ClerkProvider } from "@clerk/nextjs";
import { HeroUIProvider } from "@heroui/system";
import { ToastProvider } from "@heroui/toast";

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  const router = useRouter();

  return (
    <ClerkProvider>
      <HeroUIProvider navigate={router.push}>
        <ToastProvider
          toastProps={{
            radius: "full",
            color: "primary",
            variant: "flat",
            timeout: 1000,
            hideIcon: true,
            classNames: {
              closeButton:
                "opacity-100 absolute right-4 top-1/2 -translate-y-1/2",
            },
          }}
        />
        {children}
      </HeroUIProvider>
    </ClerkProvider>
  );
}
