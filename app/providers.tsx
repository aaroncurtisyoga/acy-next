"use client";

import { ReactNode, useMemo } from "react";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider, useTheme } from "next-themes";
import { TooltipProvider } from "@/components/ui/tooltip";

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
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange={false}
    >
      <ThemedClerkProvider>
        <TooltipProvider delayDuration={300}>
          <Toaster richColors closeButton position="bottom-right" />
          {children}
        </TooltipProvider>
      </ThemedClerkProvider>
    </ThemeProvider>
  );
}
