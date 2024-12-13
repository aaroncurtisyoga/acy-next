"use client";

import { FC } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useClerk, useUser } from "@clerk/nextjs";
import { NavbarContent, NavbarMenu, NavbarMenuToggle } from "@nextui-org/react";
import CustomMobileMenuItem from "@/_components/Header/CustomMobileMenuItem";

interface MobileNavbarContentProps {
  isMenuOpen: boolean;
  menuItems: { name: string; href: string; testId: string }[];
  setIsMenuOpen: (open: boolean) => void;
}

const MobileNavbarContent: FC<MobileNavbarContentProps> = ({
  isMenuOpen,
  menuItems,
  setIsMenuOpen,
}) => {
  const router = useRouter();
  const { isSignedIn } = useUser();
  const { signOut } = useClerk();

  return (
    <>
      {/* Hamburger Menu */}
      <NavbarContent className="sm:hidden" justify="end">
        <NavbarMenuToggle
          data-testid="menu-toggle"
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          aria-pressed={isMenuOpen}
          className="sm:hidden w-10 h-10 p-2 rounded-full flex items-center justify-center tap-highlight-transparent outline-none focus:outline-none focus:ring-2 focus:ring-primary transition-transform"
        >
          <span className="sr-only">
            {isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
          </span>
          <span
            className={`pointer-events-none flex flex-col items-center justify-center transition-transform duration-150 ${
              isMenuOpen ? "rotate-45" : "rotate-0"
            }`}
          >
            <span
              className={`block h-px w-6 bg-current transition-transform ${
                isMenuOpen ? "translate-y-px" : "-translate-y-1"
              }`}
            />
            <span
              className={`block h-px w-6 bg-current transition-transform ${
                isMenuOpen
                  ? "-rotate-90 translate-y-0"
                  : "rotate-0 translate-y-1"
              }`}
            />
          </span>
        </NavbarMenuToggle>
      </NavbarContent>
      {/* Auth and Unauthenticated Links*/}
      <NavbarMenu data-testid="navbar-menu" className="items-end w-full">
        {menuItems.map((link, index) => (
          <CustomMobileMenuItem
            link={link}
            setIsMenuOpen={setIsMenuOpen}
            key={link.name}
          />
        ))}

        {/* Show the Log in or Log Out Button */}
        {isSignedIn ? (
          <CustomMobileMenuItem>
            <button
              type="button"
              onClick={() => signOut(() => router.push("/"))}
              className="w-full text-lg font-medium text-gray-800 text-right"
            >
              Log out
            </button>
          </CustomMobileMenuItem>
        ) : (
          <CustomMobileMenuItem>
            <Link href={"/sign-in"}>Log in</Link>
          </CustomMobileMenuItem>
        )}
      </NavbarMenu>
    </>
  );
};

export default MobileNavbarContent;
