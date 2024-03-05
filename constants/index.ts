export const aboutLinks = [
  {
    name: "Schedule",
    href: "/about/schedule",
  },
  {
    name: "Newsletter",
    href: "/about/newsletter",
  },
];

export const userLinks = [];

export const adminLinks = [{ name: "Admin", href: "/dashboard" }];

export const authenticatedLinks = [{ name: "My Account", href: "/profile" }];

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
