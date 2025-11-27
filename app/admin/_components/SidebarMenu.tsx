"use client";

import { usePathname, useRouter } from "next/navigation";
import { Listbox, ListboxItem } from "@heroui/react";
import { adminDashboardLinks } from "@/app/_lib/constants";
import ThemeToggle from "@/app/_components/ThemeToggle";

const SidebarMenu = () => {
  const pathname = usePathname();
  const router = useRouter();

  // Function to handle navigation
  const handleNavigation = (path: string) => {
    console.log("Navigating to:", path);
    router.push(path);
  };

  return (
    <div className="flex flex-col h-full">
      <Listbox
        aria-label="Admin Navigation"
        className="mt-5 flex-1"
        selectionMode="single"
        selectedKeys={[pathname]}
      >
        {adminDashboardLinks.map((link) => (
          <ListboxItem
            key={link.path}
            startContent={<link.icon size={18} />}
            textValue={link.name}
            variant="bordered"
            className={`mb-2 ${pathname === link.path ? "bg-primary-100 dark:bg-primary-800 dark:text-white" : ""}`}
            onPress={() => handleNavigation(link.path)}
          >
            {link.name}
          </ListboxItem>
        ))}
      </Listbox>

      <div className="mt-auto pt-4 border-t border-divider">
        <div className="flex justify-center">
          <ThemeToggle />
        </div>
      </div>
    </div>
  );
};

export default SidebarMenu;
