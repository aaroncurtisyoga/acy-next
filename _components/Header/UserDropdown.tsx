"use client";

import { FC, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useClerk, useUser } from "@clerk/nextjs";
import { User } from "lucide-react";

interface UserDropdownProps {
  linksForLoggedInUsers: { href: string; name: string }[];
}

const UserDropdown: FC<UserDropdownProps> = ({ linksForLoggedInUsers }) => {
  const { signOut } = useClerk();
  const { isSignedIn } = useUser();
  const router = useRouter();

  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isDesktopMenuOpen, setIsDesktopMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsDesktopMenuOpen((prev) => !prev);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setIsDesktopMenuOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSignOut = () => {
    signOut(() => router.push("/"));
    setIsDesktopMenuOpen(false);
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
      {isDesktopMenuOpen && (
        <div
          className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md border z-10"
          role="menu"
        >
          {linksForLoggedInUsers.map((link) => (
            <Link
              href={link.href}
              key={link.name}
              className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
              onClick={() => setIsDesktopMenuOpen(false)}
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
              onClick={() => setIsDesktopMenuOpen(false)}
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
