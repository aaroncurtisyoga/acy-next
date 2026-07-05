"use client";

import { FC } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Mail, Users } from "lucide-react";
import { cn } from "@/app/_lib/utils";

const tabs = [
  { name: "Newsletters", href: "/admin/newsletter", icon: Mail, exact: true },
  {
    name: "Subscribers",
    href: "/admin/newsletter/subscribers",
    icon: Users,
    exact: false,
  },
];

/**
 * Segmented tab bar shared by the two newsletter hub pages so switching between
 * composing and managing the list is one click and stays URL-addressable.
 * The full-screen compose routes (/create, /[id]) deliberately don't render it.
 */
const NewsletterNav: FC = () => {
  const pathname = usePathname();

  return (
    <div className="mb-6 border-b border-border">
      <nav className="-mb-px flex gap-1" aria-label="Newsletter sections">
        {tabs.map((tab) => {
          const isActive = tab.exact
            ? pathname === tab.href
            : pathname.startsWith(tab.href);
          return (
            <Link
              key={tab.href}
              href={tab.href}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "flex items-center gap-2 border-b-2 px-4 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:border-border hover:text-foreground",
              )}
            >
              <tab.icon className="h-4 w-4" />
              {tab.name}
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default NewsletterNav;
