"use client";

import { FC, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { useClerk, useUser } from "@clerk/nextjs";
import { NavbarContent, NavbarItem } from "@nextui-org/react";
import { User } from "lucide-react";
import { unauthenticatedLinks } from "@/_lib/constants";

interface DesktopNavbarContentProps {
  authenticatedLinks: { name: string; href: string; testId: string }[];
}

const DesktopNavbarContent: FC<DesktopNavbarContentProps> = ({
  authenticatedLinks,
}) => {
  const { isSignedIn } = useUser();
  const router = useRouter();
  const pathname = usePathname();
  const { signOut } = useClerk();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleSignOut = () => {
    signOut(() => router.push("/"));
    setIsMenuOpen(false);
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen]);

  return (
    <NavbarContent className="hidden sm:flex gap-4" justify="end">
      {/* Auth and Unauthenticated Links */}
      {unauthenticatedLinks.map((link, index) => (
        <NavbarItem
          data-testid={`navbar-item-${link.testId}`}
          key={`${link.name}-${index}`}
          isActive={pathname.includes(link.href)}
        >
          <Link className="w-full" href={link.href}>
            {link.name}
          </Link>
        </NavbarItem>
      ))}

      {/* User Dropdown */}
      <div className="relative" ref={dropdownRef}>
        <button
          aria-label="User menu"
          className="flex items-center"
          onClick={toggleMenu}
        >
          <User className="w-6 h-6" />
        </button>
        {isMenuOpen && (
          <div
            className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md border z-10"
            role="menu"
          >
            {authenticatedLinks.map((link) => (
              <Link
                href={link.href}
                key={link.name}
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                onClick={() => setIsMenuOpen(false)} // Close menu on link click
              >
                {link.name}
              </Link>
            ))}
            {isSignedIn ? (
              <button
                onClick={handleSignOut}
                className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
              >
                Log out
              </button>
            ) : (
              <Link
                href="/sign-in"
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                onClick={() => setIsMenuOpen(false)} // Close menu on link click
              >
                Log in
              </Link>
            )}
          </div>
        )}
      </div>
    </NavbarContent>
  );
};

export default DesktopNavbarContent;
