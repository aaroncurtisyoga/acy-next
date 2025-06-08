"use client";

import React, { ReactNode } from "react";
import SidebarMenu from "@/app/admin/_components/SidebarMenu";

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
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
