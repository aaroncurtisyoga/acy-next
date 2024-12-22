"use client";

import React from "react";
import {
  DropdownMenu as NextUIDropdownMenu,
  DropdownItem,
} from "@nextui-org/react";

interface UserDropdownMenuProps {
  authenticatedLinks: Array<{ name: string; href: string; testId: string }>;
  isSignedIn: boolean;
  signOut: () => void;
}

const UserDropdownMenu: React.FC<UserDropdownMenuProps> = ({
  authenticatedLinks,
  isSignedIn,
  signOut,
}) => {
  // Combine authenticated links with logout/login
  const links = [
    ...authenticatedLinks,
    isSignedIn
      ? { name: "Log out", href: "#logout", testId: "logout", action: signOut }
      : { name: "Log in", href: "/sign-in", testId: "login" },
  ];

  return (
    <NextUIDropdownMenu aria-label="User Menu" variant="flat" items={links}>
      {(item) => (
        <DropdownItem key={item.testId} href={item.href}>
          {item.name}
        </DropdownItem>
      )}
    </NextUIDropdownMenu>
  );
};

export default UserDropdownMenu;
