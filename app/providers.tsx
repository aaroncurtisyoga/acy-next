"use client";

import { ReactNode, useMemo } from "react";
import { useRouter } from "next/navigation";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { HeroUIProvider } from "@heroui/system";
import { ToastProvider } from "@heroui/toast";
import { ThemeProvider, useTheme } from "next-themes";

interface ProvidersProps {
  children: ReactNode;
}

// ClerkProvider wrapper with theme support
function ThemedClerkProvider({ children }: { children: ReactNode }) {
  const { resolvedTheme } = useTheme();

  // Memoize appearance to prevent unnecessary re-renders
  // resolvedTheme is undefined during SSR, so dark theme only applies client-side
  const appearance = useMemo(
    () => ({
      baseTheme: resolvedTheme === "dark" ? dark : undefined,
    }),
    [resolvedTheme],
  );

  return <ClerkProvider appearance={appearance}>{children}</ClerkProvider>;
}

export function Providers({ children }: ProvidersProps) {
  const router = useRouter();

  return (
    <HeroUIProvider navigate={router.push}>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange={false}
      >
        <ThemedClerkProvider>
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
        </ThemedClerkProvider>
      </ThemeProvider>
    </HeroUIProvider>
  );
}
