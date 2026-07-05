"use client";

import type { ComponentType } from "react";
import { usePathname, useRouter } from "next/navigation";
import { adminNavLinks, mainSiteLink } from "@/app/_lib/constants";
import { SimpleTooltip } from "@/components/ui/simple-tooltip";
import { cn } from "@/app/_lib/utils";

interface SidebarMenuProps {
  onClose?: () => void;
  collapsed?: boolean;
}

type NavLink = {
  name: string;
  path: string;
  icon: ComponentType<{ size?: number | string; className?: string }>;
};

const SidebarMenu = ({ onClose, collapsed }: SidebarMenuProps) => {
  const pathname = usePathname();
  const router = useRouter();

  const handleNavigation = (path: string) => {
    router.push(path);
    onClose?.();
  };

  // Highlight the most specific matching section, so a sub-route like
  // /admin/events/create keeps Events lit, and /admin/events/orders lights
  // Orders (the longer match) rather than Events.
  const activePath = adminNavLinks
    .map((link) => link.path)
    .filter((path) => pathname === path || pathname.startsWith(`${path}/`))
    .sort((a, b) => b.length - a.length)[0];

  const renderLink = (link: NavLink, isActive: boolean) => {
    const button = (
      <button
        key={link.path}
        onClick={() => handleNavigation(link.path)}
        aria-current={isActive ? "page" : undefined}
        className={cn(
          "flex w-full items-center gap-3 rounded-lg text-sm transition-colors",
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
  };

  return (
    <div className="flex h-full flex-col">
      <nav aria-label="Admin Navigation" className="mt-5 flex-1 space-y-1">
        {adminNavLinks.map((link) =>
          renderLink(link, link.path === activePath),
        )}
      </nav>
      <div className="mt-4 space-y-1 border-t border-border pt-4">
        {renderLink(mainSiteLink, false)}
      </div>
    </div>
  );
};

export default SidebarMenu;
