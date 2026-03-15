"use client";

import { ReactNode, useState } from "react";
import { useRouter } from "next/navigation";
import { Menu, X, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import SidebarMenu from "@/app/admin/_components/SidebarMenu";
import ThemeToggle from "@/app/_components/ThemeToggle";
import AdminProtection from "@/app/admin/_components/AdminProtection";

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <AdminProtection>
      <div className="flex flex-col md:flex-row min-h-dvh bg-background">
        {/* Mobile Header */}
        <header
          className="md:hidden flex items-center justify-between p-4 bg-background border-b border-border"
          style={{ paddingTop: "max(1rem, env(safe-area-inset-top, 0px))" }}
        >
          <h1
            className="text-xl font-bold text-foreground cursor-pointer hover:text-primary transition-colors"
            onClick={() => router.push("/admin")}
          >
            Dashboard
          </h1>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-lg hover:bg-muted transition-colors"
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </header>

        {/* Mobile Drawer Overlay */}
        {isMobileMenuOpen && (
          <div
            className="md:hidden fixed inset-0 z-40 bg-black/50"
            onClick={closeMobileMenu}
          />
        )}

        {/* Mobile Drawer */}
        <aside
          className={`md:hidden fixed top-0 left-0 z-50 h-full w-64 bg-background border-r border-border p-4 flex flex-col transform transition-transform duration-300 ease-in-out ${
            isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <h1
              className="text-xl font-bold text-foreground cursor-pointer hover:text-primary transition-colors"
              onClick={() => {
                router.push("/admin");
                closeMobileMenu();
              }}
            >
              Dashboard
            </h1>
            <button
              onClick={closeMobileMenu}
              className="p-2 rounded-lg hover:bg-muted transition-colors"
              aria-label="Close menu"
            >
              <X size={20} />
            </button>
          </div>
          <div className="flex-1 flex flex-col">
            <SidebarMenu onClose={closeMobileMenu} />
          </div>
        </aside>

        {/* Desktop Sidebar */}
        <aside
          className={`hidden md:flex bg-background border-r border-border p-4 flex-col transition-all duration-300 ${
            isSidebarCollapsed ? "md:w-16" : "md:w-64"
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            {!isSidebarCollapsed && (
              <h1
                className="text-2xl font-bold text-foreground cursor-pointer hover:text-primary transition-colors"
                onClick={() => router.push("/admin")}
              >
                Dashboard
              </h1>
            )}
            <button
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
              aria-label={
                isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"
              }
            >
              {isSidebarCollapsed ? (
                <PanelLeftOpen size={18} />
              ) : (
                <PanelLeftClose size={18} />
              )}
            </button>
          </div>
          <div className="flex-1 flex flex-col">
            <SidebarMenu collapsed={isSidebarCollapsed} />
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-4 bg-background text-foreground flex flex-col">
          <div className="flex-1">{children}</div>
          <div className="mt-8 pt-4 border-t border-border md:hidden">
            <div className="flex justify-center">
              <ThemeToggle />
            </div>
          </div>
        </main>
      </div>
    </AdminProtection>
  );
}
