"use client";

import { ReactNode } from "react";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "next-themes";
import { TooltipProvider } from "@/components/ui/tooltip";

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <ThemeProvider
      attribute="class"
      forcedTheme="light"
      disableTransitionOnChange={false}
    >
      <ClerkProvider>
        <TooltipProvider delayDuration={300}>
          <Toaster richColors closeButton position="bottom-right" />
          {children}
        </TooltipProvider>
      </ClerkProvider>
    </ThemeProvider>
  );
}
