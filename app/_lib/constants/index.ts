import {
  Bike,
  Boxes,
  Calendar,
  Car,
  Footprints,
  TramFront,
  UsersRound,
  RefreshCw,
  Home,
  ExternalLink,
} from "lucide-react";
import { TravelOption } from "@/app/_lib/types";

export const unauthenticatedLinks = [
  // {
  //   name: "Private Sessions",
  //   href: "/private-sessions",
  //   testId: "private-sessions-link",
  // },
];

export const adminLinks = [
  { name: "Admin", href: "/admin/events", testId: "admin-link" },
];

export const authenticatedLinks = [
  { name: "Account", href: "/account", testId: "account-link" },
];

export const eventFormBasicInfoDefaultValues = {
  category: "",
  endDateTime: "",
  isHostedExternally: false,
  location: {
    formattedAddress: "",
    lat: 0,
    lng: 0,
    name: "",
    placeId: "",
  },
  startDateTime: "",
  title: "",
};

export const eventFormDetailsForInternallyHostedEventDefaultValues = {
  description: "",
  imageUrl: "",
  price: "",
  maxAttendees: 0,
};
export const eventFormDetailsForExternallyHostedEventDefaultValues = {
  externalRegistrationUrl: "",
};

export const eventFormDefaultValues = {
  ...eventFormBasicInfoDefaultValues,
  ...eventFormDetailsForInternallyHostedEventDefaultValues,
  ...eventFormDetailsForExternallyHostedEventDefaultValues,
};

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

export const instructorEmailAddress = "aaroncurtisyoga@gmail.com";

export const adminDashboardLinks = [
  { name: "Events", path: "/admin/events", icon: Calendar },
  { name: "Categories", path: "/admin/categories", icon: Boxes },
  { name: "Users", path: "/admin/users", icon: UsersRound },
  { name: "Sync Events", path: "/admin/sync", icon: RefreshCw },
  { name: "Main Site", path: "/", icon: ExternalLink },
];

export const TableEventManagementColumns = [
  "Start Date",
  "Name",
  "Category",
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

export const orderTypeLabels = {
  EVENT: "Event",
  PRIVATE_SESSION: "Private Session",
};

export const selectedPackageDetailsDefaultValues = {
  title: "",
  price: "",
  description: "",
  features: [],
};
