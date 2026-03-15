"use client";

import { usePathname, useRouter } from "next/navigation";
import { adminDashboardLinks } from "@/app/_lib/constants";
import { SimpleTooltip } from "@/components/ui/simple-tooltip";
import ThemeToggle from "@/app/_components/ThemeToggle";
import { cn } from "@/app/_lib/utils";

interface SidebarMenuProps {
  onClose?: () => void;
  collapsed?: boolean;
}

const SidebarMenu = ({ onClose, collapsed }: SidebarMenuProps) => {
  const pathname = usePathname();
  const router = useRouter();

  const handleNavigation = (path: string) => {
    router.push(path);
    onClose?.();
  };

  return (
    <div className="flex flex-col h-full">
      <nav aria-label="Admin Navigation" className="mt-5 flex-1 space-y-1">
        {adminDashboardLinks.map((link) => {
          const isActive = pathname === link.path;
          const button = (
            <button
              key={link.path}
              onClick={() => handleNavigation(link.path)}
              className={cn(
                "flex items-center gap-3 w-full rounded-lg text-sm transition-colors",
                collapsed ? "justify-center px-2 py-2" : "px-3 py-2",
                isActive
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              <link.icon size={18} />
              {!collapsed && link.name}
            </button>
          );

          if (collapsed) {
            return (
              <SimpleTooltip key={link.path} content={link.name} side="right">
                {button}
              </SimpleTooltip>
            );
          }

          return button;
        })}
      </nav>

      <div className="mt-auto pt-4 border-t border-border hidden md:block">
        <div className="flex justify-center">
          <ThemeToggle />
        </div>
      </div>
    </div>
  );
};

export default SidebarMenu;
