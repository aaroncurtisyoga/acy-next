"use client";

import { FC, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useClerk, useUser } from "@clerk/nextjs";
import { LogOut, Settings, Shield, ChevronRight } from "lucide-react";
import { track } from "@vercel/analytics";

interface UserDropdownProps {
  linksForLoggedInUsers: { href: string; name: string; testId: string }[];
  isSignedIn?: boolean;
  isLoaded?: boolean;
  className?: string;
}

const UserDropdown: FC<UserDropdownProps> = ({
  linksForLoggedInUsers,
  isSignedIn = false,
  isLoaded = false,
  className = "",
}) => {
  const { signOut } = useClerk();
  const { user } = useUser();
  const router = useRouter();

  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({
    top: 0,
    right: 0,
  });

  const toggleMenu = () => {
    if (!isDropdownOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + window.scrollY + 12,
        right: window.innerWidth - rect.right,
      });
    }
    track("user_dropdown", {
      action: "toggle",
      state: !isDropdownOpen ? "open" : "close",
      signed_in: isSignedIn,
    });
    setIsDropdownOpen((prev) => !prev);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setIsDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSignOut = () => {
    track("auth", {
      action: "sign_out",
      source: "user_dropdown",
    });
    signOut(() => router.push("/"));
    setIsDropdownOpen(false);
  };

  const closeDropdown = () => {
    setIsDropdownOpen(false);
  };

  // Simple header link styling
  const buttonClasses = "group cursor-pointer";

  // Get user initials for avatar
  const userInitials =
    user?.firstName && user?.lastName
      ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
      : user?.emailAddresses?.[0]?.emailAddress?.[0]?.toUpperCase() || "U";

  // Avatar component that shows image or falls back to initials
  const AvatarDisplay = ({ className }: { className: string }) => {
    const [imageError, setImageError] = useState(false);

    if (user?.hasImage && user?.imageUrl && !imageError) {
      return (
        <Image
          src={user.imageUrl}
          alt="Profile"
          className={className}
          width={40}
          height={40}
          onError={() => setImageError(true)}
        />
      );
    }
    return <div className={className}>{userInitials}</div>;
  };

  // Only the admin uses authentication, so the public header shows no account
  // control for signed-out (or still-loading) visitors. The admin signs in by
  // navigating to /admin, which redirects to the Clerk sign-in page.
  if (!isLoaded || !isSignedIn) {
    return null;
  }

  return (
    <div className={`relative isolate ${className}`} ref={dropdownRef}>
      <button
        ref={buttonRef}
        data-testid="user-menu-button"
        aria-label="Account menu"
        aria-expanded={isDropdownOpen}
        aria-haspopup="menu"
        className={buttonClasses}
        onClick={toggleMenu}
      >
        <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center text-white font-medium text-sm shadow-lg border-2 border-white hover:shadow-xl transition-shadow duration-200 overflow-hidden">
          <AvatarDisplay className="w-full h-full rounded-full object-cover flex items-center justify-center text-white font-medium text-sm" />
        </div>
      </button>

      {isDropdownOpen &&
        typeof window !== "undefined" &&
        createPortal(
          <div
            ref={dropdownRef}
            className="fixed w-64 bg-white/95 backdrop-blur-xl shadow-2xl rounded-2xl border border-gray-200/50 overflow-hidden animate-in fade-in slide-in-from-top-1 duration-200 z-[9999]"
            style={{
              top: dropdownPosition.top,
              right: dropdownPosition.right,
            }}
            role="menu"
            aria-labelledby="user-menu-button"
            data-testid="user-dropdown-menu"
          >
            {/* User info header for signed-in users */}
            {isSignedIn && user && (
              <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center text-white font-medium shadow-lg border-2 border-white overflow-hidden">
                    <AvatarDisplay className="w-full h-full rounded-full object-cover flex items-center justify-center text-white font-medium" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {user.fullName || user.emailAddresses?.[0]?.emailAddress}
                    </p>
                    {user.publicMetadata?.role === "admin" && (
                      <div className="flex items-center gap-1 mt-0.5">
                        <Shield className="w-3 h-3 text-amber-600" />
                        <span className="text-xs text-amber-600 font-medium">
                          Admin
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            <div className="py-2">
              {isSignedIn &&
                linksForLoggedInUsers.map((link) => (
                  <Link
                    data-testid={link.testId}
                    href={link.href}
                    key={link.name}
                    className="group flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-primary/10 hover:text-primary transition-all duration-200"
                    role="menuitem"
                    onClick={() => {
                      track("user_dropdown", {
                        action: "admin_link_click",
                        destination: link.name.toLowerCase(),
                        href: link.href,
                      });
                      closeDropdown();
                    }}
                  >
                    <Settings className="w-4 h-4 text-gray-400 group-hover:text-primary transition-colors" />
                    <span className="flex-1">{link.name}</span>
                    <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-primary group-hover:translate-x-0.5 transition-all duration-200" />
                  </Link>
                ))}

              <div className="mx-4 my-2 h-px bg-gray-200" />
              <button
                data-testid="logout-button"
                onClick={handleSignOut}
                className="group flex items-center gap-3 w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-all duration-200"
                role="menuitem"
              >
                <LogOut className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors duration-200" />
                <span className="flex-1">Sign out</span>
              </button>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
};

export default UserDropdown;
