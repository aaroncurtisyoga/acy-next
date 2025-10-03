"use client";

import { Button } from "@heroui/react";
import Link from "next/link";
import { Home, RefreshCw, ServerCrash } from "lucide-react";
import Header from "@/app/_components/Header/Header";
import Footer from "@/app/_components/Footer";
import { instructorEmailAddress } from "@/app/_lib/constants";
import { robotoFlex } from "@/app/fonts";
import { Providers } from "@/app/providers";
import "./globals.css";

export default function GlobalError({
  reset,
  error,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${robotoFlex.className}`} suppressHydrationWarning>
        <Providers>
          <div className="min-h-screen flex flex-col bg-white dark:bg-[#0a0a0a]">
            <Header />
            <main className="flex-1 flex items-center justify-center bg-white dark:bg-[#0a0a0a]">
              <div className="max-w-2xl w-full text-center px-6 py-12">
                {/* Error Display */}
                <div className="mb-8">
                  <div className="flex justify-center mb-6">
                    <ServerCrash className="w-16 h-16 text-gray-400 dark:text-gray-500" />
                  </div>
                  <h1 className="text-6xl md:text-7xl font-bold text-foreground-200 dark:text-foreground-800 select-none mb-4">
                    500
                  </h1>
                  <div className="relative -mt-4">
                    <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 dark:text-gray-100">
                      Something went wrong
                    </h2>
                  </div>
                </div>

                {/* Description */}
                <p className="text-foreground-600 dark:text-foreground-400 text-lg mb-8 leading-relaxed max-w-md mx-auto">
                  We encountered an unexpected error while loading this page.
                  Don&apos;t worry, our team has been notified and we&apos;re
                  working on it.
                </p>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
                  <Button
                    onPress={() => reset()}
                    color="primary"
                    size="lg"
                    startContent={<RefreshCw className="w-4 h-4" />}
                    className="font-medium min-w-[140px]"
                  >
                    Try Again
                  </Button>

                  <Button
                    as={Link}
                    href="/"
                    variant="bordered"
                    size="lg"
                    startContent={<Home className="w-4 h-4" />}
                    className="font-medium min-w-[140px] border-2"
                  >
                    Go Home
                  </Button>
                </div>

                {/* Error Details (if available) */}
                {error?.digest && (
                  <div className="mb-8 p-4 bg-foreground-50 dark:bg-foreground-900/20 rounded-lg">
                    <p className="text-xs text-foreground-500 dark:text-foreground-400 font-mono">
                      Error ID: {error.digest}
                    </p>
                  </div>
                )}

                {/* Additional Help */}
                <div className="mt-12 pt-8 border-t border-divider">
                  <p className="text-sm text-foreground-500 dark:text-foreground-400">
                    If the problem persists, please{" "}
                    <Link
                      href={`mailto:${instructorEmailAddress}?subject=Error%20Report&body=Error%20ID:%20${error?.digest || "Unknown"}`}
                      className="text-primary-600 dark:text-primary-400 hover:underline font-medium"
                    >
                      send an email
                    </Link>
                  </p>
                </div>
              </div>
            </main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
