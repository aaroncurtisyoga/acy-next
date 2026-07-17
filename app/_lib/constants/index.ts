import {
  Bike,
  Boxes,
  Calendar,
  Car,
  Footprints,
  LayoutDashboard,
  Mail,
  ShoppingBag,
  TramFront,
  UsersRound,
  RefreshCw,
  ExternalLink,
} from "lucide-react";
import { OrderType } from "@prisma/client";
import { TravelOption } from "@/app/_lib/types";

export const unauthenticatedLinks = [
  // {
  //   name: "Private Sessions",
  //   href: "/private-sessions",
  //   testId: "private-sessions-link",
  // },
  { name: "classes", href: "/#this-week", testId: "classes-link" },
  { name: "events", href: "/#upcoming", testId: "events-link" },
];

export const adminLinks = [
  { name: "Admin", href: "/admin/events", testId: "admin-link" },
];

export const authenticatedLinks = [
  { name: "Account", href: "/account", testId: "account-link" },
];

export const travelOptions: TravelOption[] = [
  {
    travelMode: "driving",
    icon: Car,
  },
  {
    travelMode: "walking",
    icon: Footprints,
  },
  {
    travelMode: "transit",
    icon: TramFront,
  },
  {
    travelMode: "bicycling",
    icon: Bike,
  },
];

export const instructorEmailAddress = "hi@aaroncurtisyoga.com";

export const adminNavLinks = [
  { name: "Dashboard", path: "/admin", icon: LayoutDashboard },
  { name: "Events", path: "/admin/events", icon: Calendar },
  { name: "Orders", path: "/admin/events/orders", icon: ShoppingBag },
  { name: "Categories", path: "/admin/categories", icon: Boxes },
  { name: "Users", path: "/admin/users", icon: UsersRound },
  { name: "Newsletter", path: "/admin/newsletter", icon: Mail },
  { name: "Sync Events", path: "/admin/sync", icon: RefreshCw },
];

// Rendered apart from the admin sections — it leaves the admin area entirely.
export const mainSiteLink = {
  name: "Back to site",
  path: "/",
  icon: ExternalLink,
};

export const TableEventManagementColumns = [
  "Date & Time",
  "Event Details",
  "Category",
  "Status",
  "Actions",
];

export const TableManageUsersColumns = [
  "First Name",
  "Last Name",
  "Email",
  "UID",
  "Actions",
];

export const EventHistoryTableColumns = [
  "Date",
  "Amount",
  "Event",
  "Order ID",
  "Type",
];

// Typed against the Prisma OrderType enum so adding a new order type is a
// compile error here (a missing label) rather than an `undefined` at render.
export const orderTypeLabels: Record<OrderType, string> = {
  EVENT: "Event",
  PRIVATE_SESSION: "Private Session",
};

/**
 * Canonical `Event.sourceType` values for synced events. `sourceType` is a
 * plain String column (only two sources today, so deliberately not a Prisma
 * enum), so this const is the single source of truth shared by the sync
 * services and the sync-status route. Add a member here when wiring a new
 * sync source.
 */
export const SOURCE_TYPES = {
  BRIGHT_BEAR: "MOMENCE",
  DCBP: "ZOOMSHIFT",
} as const;

export type SourceType = (typeof SOURCE_TYPES)[keyof typeof SOURCE_TYPES];
