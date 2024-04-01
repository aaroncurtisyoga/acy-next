import { Bike, Car, Footprints, TramFront } from "lucide-react";
import { TravelMode, TravelOption } from "@/types";

export const userLinks = [];

export const adminLinks = [{ name: "Admin", href: "/dashboard" }];

export const authenticatedLinks = [{ name: "Account", href: "/account" }];

export const signUpLinks = {
  crossFitDc: "https://crossfitdc.com/",
  dcBoulderingProject: "https://www.dcboulderingproject.com/yoga-fitness",
};

export const locations = {
  BOULDERING_PROJECT: "DC Bouldering Project",
  CROSSFIT_DC: "CrossFit DC",
};

export const eventDefaultValues = {
  title: "",
  categoryId: "",
  description: "",
  endDateTime: new Date(),
  imageUrl: "",
  isFree: false,
  isHostedExternally: false,
  location: {
    description: "",
    placeId: "",
    structuredFormatting: {
      mainText: "",
      secondaryText: "",
    },
  },
  price: "",
  startDateTime: new Date(),
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

export const eventFormSteps = [
  {
    id: "Step 1",
    name: "Event Overview",
  },
  {
    id: "Step 2",
    name: "Event Details",
  },
  {
    id: "Step 3",
    name: "Form Complete",
  },
];
