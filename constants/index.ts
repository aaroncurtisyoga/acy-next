import { Bike, Car, Footprints, TramFront } from "lucide-react";
import { TravelOption } from "@/types";

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
  categoryId: "",
  description: "",
  endDateTime: new Date(),
  externalRegistrationUrl: "",
  imageUrl: "",
  isFree: false,
  isHostedExternally: false,
  location: {
    formattedAddress: "",
    geometry: {
      lat: 0,
      lng: 0,
    },
    name: "",
    placeId: "",
  },
  maxAttendees: 0,
  price: "",
  startDateTime: new Date(),
  title: "",
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

export const getEventFormSteps = (isHostedExternally = false) => {
  return [
    {
      id: "Step 1",
      fields: [
        "endDateTime",
        "isHostedExternally",
        "location",
        "startDateTime",
        "title",
      ],
      name: "Event Overview",
    },
    {
      id: "Step 2",
      fields: isHostedExternally
        ? ["externalRegistrationUrl"]
        : ["categoryId", "description", "imageUrl", "price"],
      name: "Event Details",
    },
    {
      id: "Step 3",
      name: "Form Complete",
    },
  ];
};
