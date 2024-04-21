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

export const eventFormStepOneDefaultValues = {
  endDateTime: new Date(),
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
  startDateTime: new Date(),
  title: "",
};

export const eventFormStepTwoDefaultValues = {
  categoryId: "",
  description: "",
  imageUrl: "",
  price: "",
  externalRegistrationUrl: "",
};

export const eventFormDefaultValues = {
  ...eventFormStepOneDefaultValues,
  ...eventFormStepTwoDefaultValues,
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
      number: 1,
      name: "Event Overview",
    },
    {
      number: 2,
      name: "Event Details",
    },
    {
      number: 3,
      name: "Submit Form",
    },
  ];
};

export const instructorEmailAddress = "aaroncurtisyoga@gmail.com";
