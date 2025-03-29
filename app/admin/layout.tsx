"use client";

import React, { ReactNode } from "react";
import { usePathname } from "next/navigation";
import SidebarMenu from "@/app/admin/_components/SidebarMenu";

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();

  // Debugging helper - log the current pathname
  console.log("Current pathname in admin layout:", pathname);

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-gray-100 p-4">
        <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
        <SidebarMenu />
      </aside>

      {/* Main content */}
      <main className="flex-1 p-4">{children}</main>
    </div>
  );
}
