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

export const authenticatedLinks = [{ name: "My Profile", href: "/profile" }];

export const signUpLinks = {
  crossFitDc: "https://crossfitdc.com/",
  dcBoulderingProject: "https://www.dcboulderingproject.com/yoga-fitness",
};

export const locations = {
  BOULDERING_PROJECT: "DC Bouldering Project",
  CROSSFIT_DC: "CrossFit DC",
};

export const faqInfo = [
  {
    question: "How often do you practice?",
    answer:
      "The majority of my yoga practice is breathwork and meditation. I feel my best when I do this daily. I also love taking Vinyasa classes in-person & online whenever I can. But these days a lot of my movement comes from CrossFit. I modify the workouts to prioritize building strength for arm balances & inversions.",
  },
  {
    question: "What level are your Vinyasa classes?",
    answer: `I really believe in teaching to the people in the room. So, if a class has a large amount of one level in the class, I’ll lean my class in that direction. Although, I always give options so everyone is included in the exploratory practice of Vinyasa.`,
  },
  {
    question: "Do you teach weekends?",
    answer:
      "Yes! Weekends are when I host events, workshops, and long form" +
      " classes. Sign up to the newsletter to get an update on when these are. If you’re interested in having me teach an event at your studio or location, please reach out at aaroncurtisyoga@gmail.com\n",
  },
];

export const eventDefaultValues = {
  title: "",
  description: "",
  location: {
    description: "",
    placeId: "",
    structuredFormatting: {
      mainText: "",
      secondaryText: "",
    },
  },
  imageUrl: "",
  startDateTime: new Date(),
  endDateTime: new Date(),
  categoryId: "",
  price: "",
  isFree: false,
};
