import { Bike, Car, Footprints, TramFront } from "lucide-react";
import { TravelOption } from "@/types";

export const userLinks = [];

export const adminLinks = [{ name: "Admin", href: "/admin/dashboard" }];

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
  endDateTime: new Date(),
  isHostedExternally: false,
  location: {
    formattedAddress: "",
    lat: 0,
    lng: 0,
    name: "",
    placeId: "",
  },
  startDateTime: new Date(),
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
  { name: "Events", path: "/admin/events" },
  { name: "Categories", path: "/admin/categories" },
];
