"use client";

import { ReactNode } from "react";
import { useRouter } from "next/navigation";
import SidebarMenu from "@/app/admin/_components/SidebarMenu";
import ThemeToggle from "@/app/_components/ThemeToggle";
import AdminProtection from "@/app/admin/_components/AdminProtection";

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter();

  return (
    <AdminProtection>
      <div className="flex flex-col md:flex-row min-h-screen bg-background">
        {/* Sidebar */}
        <aside className="w-full md:w-64 bg-content1 border-r border-divider p-4 flex flex-col">
          <h1
            className="text-2xl font-bold mb-4 text-foreground cursor-pointer hover:text-primary transition-colors"
            onClick={() => router.push("/admin")}
          >
            Dashboard
          </h1>
          <div className="flex-1 flex flex-col">
            <SidebarMenu />
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-4 bg-background text-foreground flex flex-col">
          <div className="flex-1">{children}</div>
          <div className="mt-8 pt-4 border-t border-divider md:hidden">
            <div className="flex justify-center">
              <ThemeToggle />
            </div>
          </div>
        </main>
      </div>
    </AdminProtection>
  );
}
