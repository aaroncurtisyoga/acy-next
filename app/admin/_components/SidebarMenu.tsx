"use client";

import React from "react";
import Link from "next/link";
import { Listbox, ListboxItem } from "@heroui/react";
import { adminDashboardLinks } from "@/app/_lib/constants";

const SidebarMenu = () => {
  return (
    <Listbox aria-label="Actions" className={"mt-5"}>
      {adminDashboardLinks.map((link) => (
        <ListboxItem
          key={link.path}
          startContent={<link.icon />}
          textValue={link.name}
          variant={"bordered"}
        >
          <Link href={link.path}>{link.name}</Link>
        </ListboxItem>
      ))}
    </Listbox>
  );
};

export default SidebarMenu;
