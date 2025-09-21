"use client";

import { FC, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
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
  const buttonClasses = isSignedIn
    ? "group cursor-pointer"
    : "group header-link cursor-pointer";

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
        <img
          src={user.imageUrl}
          alt="Profile"
          className={className}
          onError={() => setImageError(true)}
        />
      );
    }
    return <div className={className}>{userInitials}</div>;
  };

  // Show skeleton while Clerk is loading
  if (!isLoaded) {
    return (
      <div className={`relative ${className}`}>
        <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className={`relative isolate ${className}`} ref={dropdownRef}>
      <button
        ref={buttonRef}
        data-testid="user-menu-button"
        aria-label={isSignedIn ? "Account menu" : "Sign in"}
        aria-expanded={isDropdownOpen}
        aria-haspopup="menu"
        className={buttonClasses}
        onClick={toggleMenu}
      >
        {isSignedIn ? (
          <div className="w-8 h-8 rounded-full bg-gray-600 dark:bg-gray-500 flex items-center justify-center text-white font-medium text-sm shadow-lg border-2 border-white dark:border-gray-800 hover:shadow-xl transition-shadow duration-200 overflow-hidden">
            <AvatarDisplay className="w-full h-full rounded-full object-cover flex items-center justify-center text-white font-medium text-sm" />
          </div>
        ) : (
          <span className="text-sm font-medium">Sign In</span>
        )}
      </button>

      {isDropdownOpen &&
        typeof window !== "undefined" &&
        createPortal(
          <div
            ref={dropdownRef}
            className="fixed w-64 bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl shadow-2xl rounded-2xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden animate-in fade-in slide-in-from-top-1 duration-200 z-[9999]"
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
              <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700/50 bg-gray-50/50 dark:bg-gray-900/20">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-600 dark:bg-gray-500 flex items-center justify-center text-white font-medium shadow-lg border-2 border-white dark:border-gray-700 overflow-hidden">
                    <AvatarDisplay className="w-full h-full rounded-full object-cover flex items-center justify-center text-white font-medium" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {user.fullName || user.emailAddresses?.[0]?.emailAddress}
                    </p>
                    {user.publicMetadata?.role === "admin" && (
                      <div className="flex items-center gap-1 mt-0.5">
                        <Shield className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                        <span className="text-xs text-amber-600 dark:text-amber-400 font-medium">
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
                    className="group flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-primary-50 dark:hover:bg-primary-900/10 hover:text-primary-700 dark:hover:text-primary-400 transition-all duration-200"
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
                    <Settings className="w-4 h-4 text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors" />
                    <span className="flex-1">{link.name}</span>
                    <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-primary-600 dark:group-hover:text-primary-400 group-hover:translate-x-0.5 transition-all duration-200" />
                  </Link>
                ))}

              {isSignedIn ? (
                <>
                  <div className="mx-4 my-2 h-px bg-gray-200 dark:bg-gray-700/50" />
                  <button
                    data-testid="logout-button"
                    onClick={handleSignOut}
                    className="group flex items-center gap-3 w-full text-left px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-gray-100 transition-all duration-200"
                    role="menuitem"
                  >
                    <LogOut className="w-4 h-4 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors duration-200" />
                    <span className="flex-1">Sign out</span>
                  </button>
                </>
              ) : (
                <div className="px-4 py-3">
                  <Link
                    data-testid="login-link"
                    href="/sign-in"
                    className="block w-full text-center px-4 py-2.5 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-xl transition-all duration-200 shadow-sm hover:shadow-md"
                    role="menuitem"
                    onClick={() => {
                      track("auth", {
                        action: "sign_in_click",
                        source: "user_dropdown",
                      });
                      closeDropdown();
                    }}
                  >
                    Sign in to your account
                  </Link>
                  <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-3">
                    Secure authentication powered by Clerk
                  </p>
                </div>
              )}
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
};

export default UserDropdown;
