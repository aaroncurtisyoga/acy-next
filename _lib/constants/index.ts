import {
  Bike,
  Box,
  Boxes,
  Calendar,
  Car,
  Footprints,
  TramFront,
  ClipboardPlus,
} from "lucide-react";
import { TravelOption } from "@/_lib/types";

export const userLinks = [
  {
    name: "Private Sessions",
    href: "/private-sessions",
  },
];

export const adminLinks = [{ name: "Admin", href: "/admin" }];

export const authenticatedLinks = [{ name: "Account", href: "/account" }];

export const signUpLinks = {
  crossFitDc: "https://crossfitdc.com/",
  dcBoulderingProject: "https://www.dcboulderingproject.com/yoga-fitness",
};

export const locations = {
  BOULDERING_PROJECT: "DC Bouldering Project",
  CROSSFIT_DC: "CrossFit DC",
};

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
  { name: "New Event", path: "/admin/events/create", icon: ClipboardPlus },
  { name: "Categories", path: "/admin/categories", icon: Boxes },
  { name: "New Category", path: "/admin/categories/create", icon: Box },
];
