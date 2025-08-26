"use client";

import { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { HeroUIProvider, ToastProvider } from "@heroui/react";
import { ThemeProvider, useTheme } from "next-themes";

interface ProvidersProps {
  children: ReactNode;
}

// ClerkProvider wrapper with theme support
function ThemedClerkProvider({ children }: { children: ReactNode }) {
  const { resolvedTheme } = useTheme();

  return (
    <ClerkProvider
      appearance={{
        baseTheme: resolvedTheme === "dark" ? dark : undefined,
      }}
    >
      {children}
    </ClerkProvider>
  );
}

export function Providers({ children }: ProvidersProps) {
  const router = useRouter();

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange={false}
    >
      <ThemedClerkProvider>
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
      </ThemedClerkProvider>
    </ThemeProvider>
  );
}
