"use client";

import { usePathname, useRouter } from "next/navigation";
import { Listbox, ListboxItem } from "@heroui/react";
import { adminDashboardLinks } from "@/app/_lib/constants";

const SidebarMenu = () => {
  const pathname = usePathname();
  const router = useRouter();

  // Function to handle navigation
  const handleNavigation = (path: string) => {
    console.log("Navigating to:", path);
    router.push(path);
  };

  return (
    <Listbox
      aria-label="Admin Navigation"
      className="mt-5"
      selectionMode="single"
      selectedKeys={[pathname]}
    >
      {adminDashboardLinks.map((link) => (
        <ListboxItem
          key={link.path}
          startContent={<link.icon size={18} />}
          textValue={link.name}
          variant="bordered"
          className={`mb-2 ${pathname === link.path ? "bg-primary-100" : ""}`}
          onPress={() => handleNavigation(link.path)}
        >
          {link.name}
        </ListboxItem>
      ))}
    </Listbox>
  );
};

export default SidebarMenu;
