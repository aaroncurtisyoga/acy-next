"use client";

import { FC, useEffect, useRef } from "react";
import { router } from "next/client";
import Link from "next/link";
import { useClerk, useUser } from "@clerk/nextjs";
import { User } from "lucide-react";

interface UserDropdownProps {
  isMenuOpen: boolean;
  setIsMenuOpen: (isOpen: boolean) => void;
  linksForLoggedInUsers: any;
}

const UserDropdown: FC<UserDropdownProps> = ({
  isMenuOpen,
  setIsMenuOpen,
  linksForLoggedInUsers,
}) => {
  const { signOut } = useClerk();
  const { isSignedIn } = useUser();

  const dropdownRef = useRef<HTMLDivElement>(null);

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

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleSignOut = () => {
    signOut(() => router.push("/"));
    setIsMenuOpen(false);
  };

  return (
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
          {linksForLoggedInUsers.map((link) => (
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
  );
};

export default UserDropdown;
