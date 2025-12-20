"use client";

import { FC } from "react";
import { useRouter } from "next/navigation";
import { NavbarContent, NavbarMenu, NavbarMenuToggle } from "@heroui/navbar";
import { useClerk } from "@clerk/nextjs";
import { track } from "@vercel/analytics";
import type { UserResource } from "@clerk/types";
import { useMobileMenuEffects } from "@/app/_components/Header/hooks/useMobileMenuEffects";
import MobileNavUserSection from "@/app/_components/Header/MobileNavUserSection";
import MobileNavLinks from "@/app/_components/Header/MobileNavLinks";

interface MobileNavbarContentProps {
  linksForLoggedInUsers: { href: string; name: string; testId: string }[];
  isMenuOpen: boolean;
  setIsMenuOpen: (value: boolean) => void;
  isSignedIn?: boolean;
  isLoaded?: boolean;
  user?: UserResource | null;
}

const MobileNavbarContent: FC<MobileNavbarContentProps> = ({
  linksForLoggedInUsers,
  isMenuOpen,
  setIsMenuOpen,
  isSignedIn = false,
  isLoaded = false,
  user,
}) => {
  const router = useRouter();
  const { signOut } = useClerk();
  const { closeMenu } = useMobileMenuEffects(isMenuOpen, setIsMenuOpen);

  const handleSignOut = () => {
    track("auth", {
      action: "sign_out",
      source: "mobile_menu",
    });
    signOut(() => router.push("/"));
    closeMenu();
  };

  return (
    <>
      <NavbarContent className="sm:hidden" justify="end">
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        />
      </NavbarContent>

      <NavbarMenu
        data-testid="navbar-menu-mobile"
        className="bg-white dark:bg-black shadow-xl px-4 py-4 overflow-y-auto"
      >
        <MobileNavUserSection
          isSignedIn={isSignedIn}
          isLoaded={isLoaded}
          user={user}
          onSignOut={handleSignOut}
          onClose={closeMenu}
        />

        <MobileNavLinks
          adminLinks={linksForLoggedInUsers}
          isSignedIn={isSignedIn}
          isMenuOpen={isMenuOpen}
          onClose={closeMenu}
        />
      </NavbarMenu>
    </>
  );
};

export default MobileNavbarContent;
