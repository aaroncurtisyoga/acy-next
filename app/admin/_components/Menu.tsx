"use client";

import React from "react";
import { Listbox, ListboxItem } from "@nextui-org/react";
import { adminDashboardLinks } from "@/_lib/constants";
import Link from "next/link";

const Menu = () => {
  return (
    <Listbox aria-label="Actions">
      {adminDashboardLinks.map((link) => (
        <ListboxItem key={link.path} className={"mr-2"}>
          <Link href={link.path}>{link.name}</Link>
        </ListboxItem>
      ))}
    </Listbox>
  );
};

export default Menu;
