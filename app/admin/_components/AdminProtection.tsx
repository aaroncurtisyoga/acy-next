"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, ReactNode } from "react";
import { Spinner } from "@heroui/react";

interface AdminProtectionProps {
  children: ReactNode;
}

/**
 * Client-side admin protection component
 * Provides additional layer of security for admin routes
 */
export default function AdminProtection({ children }: AdminProtectionProps) {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded) {
      // Check if user is loaded and has admin role
      const isAdmin = user?.publicMetadata?.role === "admin";

      if (!user || !isAdmin) {
        // Redirect to home if not admin
        router.push("/");
        return;
      }
    }
  }, [user, isLoaded, router]);

  // Show loading while checking auth
  if (!isLoaded) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="lg" color="primary" />
      </div>
    );
  }

  // Check if user is admin
  const isAdmin = user?.publicMetadata?.role === "admin";

  if (!user || !isAdmin) {
    // Show loading while redirecting
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="lg" color="primary" />
      </div>
    );
  }

  return <>{children}</>;
}
