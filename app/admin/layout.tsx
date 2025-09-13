"use client";

import React, { ReactNode } from "react";
import SidebarMenu from "@/app/admin/_components/SidebarMenu";

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-content1 border-r border-divider p-4 flex flex-col">
        <h1 className="text-2xl font-bold mb-4 text-foreground">
          Admin Dashboard
        </h1>
        <div className="flex-1 flex flex-col">
          <SidebarMenu />
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-4 bg-background text-foreground">
        {children}
      </main>
    </div>
  );
}
