"use client";

import { FC } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useClerk, useUser } from "@clerk/nextjs";
import { NavbarContent, NavbarMenu, NavbarMenuToggle } from "@nextui-org/react";
import CustomMobileMenuItem from "@/_components/Header/CustomMobileMenuItem";
import { unauthenticatedLinks } from "@/_lib/constants";

interface MobileNavbarContentProps {
  isMenuOpen: boolean;
  linksForLoggedInUsers: { name: string; href: string; testId: string }[];
  setIsMenuOpen: (open: boolean) => void;
}

const MobileNavbarContent: FC<MobileNavbarContentProps> = ({
  isMenuOpen,
  linksForLoggedInUsers,
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
          role={"button"}
          aria-expanded={isMenuOpen}
          aria-controls={"mobile-menu"}
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          aria-pressed={isMenuOpen}
          className="navbar-menu-toggle"
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
      {/* Unauthenticated Links */}
      <NavbarMenu data-testid="navbar-menu" className="items-end w-full">
        {unauthenticatedLinks.map((link, index) => (
          <CustomMobileMenuItem
            link={link}
            setIsMenuOpen={setIsMenuOpen}
            key={link.name}
          />
        ))}
        {/* Authenticated Links */}
        {linksForLoggedInUsers.map((link, index) => (
          <CustomMobileMenuItem
            link={link}
            setIsMenuOpen={setIsMenuOpen}
            key={link.name}
          />
        ))}

        {/* Show the Login or Log Out Button */}
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
