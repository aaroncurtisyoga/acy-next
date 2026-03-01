"use client";

import { FC } from "react";
import { useRouter } from "next/navigation";
import { useClerk } from "@clerk/nextjs";
import { track } from "@vercel/analytics";
import type { UserResource } from "@clerk/types";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import AnimatedHamburger from "@/app/_components/Header/AnimatedHamburger";
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

  const closeMenu = () => setIsMenuOpen(false);

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
      {/* Hamburger toggle - visible on mobile only */}
      <div className="sm:hidden ml-auto">
        <AnimatedHamburger
          isOpen={isMenuOpen}
          onClick={() => {
            const newState = !isMenuOpen;
            setIsMenuOpen(newState);
            track("navigation", {
              action: "hamburger_menu_toggle",
              state: newState ? "open" : "close",
            });
          }}
        />
      </div>

      {/* Mobile slide-out menu */}
      <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
        <SheetContent
          side="right"
          data-testid="navbar-menu-mobile"
          className="bg-white dark:bg-black shadow-xl px-4 py-4 overflow-y-auto w-[85%] sm:max-w-sm"
          style={{
            paddingBottom: "max(1rem, env(safe-area-inset-bottom, 0px))",
          }}
        >
          <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
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
        </SheetContent>
      </Sheet>
    </>
  );
};

export default MobileNavbarContent;
