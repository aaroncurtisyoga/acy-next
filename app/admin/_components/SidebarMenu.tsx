"use client";

import React from "react";
import { Listbox, ListboxItem } from "@nextui-org/react";
import { adminDashboardLinks } from "@/_lib/constants";
import Link from "next/link";

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
