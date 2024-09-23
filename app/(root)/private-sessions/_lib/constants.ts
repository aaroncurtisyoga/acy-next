import {
  OfferingType,
  SessionType,
} from "@/app/(root)/private-sessions/_lib/types";

export const INDIVIDUAL_OFFERINGS: OfferingType[] = [
  {
    title: "1 Session",
    price: "115",
    description: "1 hour of training",
    features: [
      "Personalized programming",
      "Virtual or In Person",
      "Breathwork",
      "Meditation",
    ],
    package: "Individual - 1 Session",
  },
  {
    title: "4 Sessions",
    price: "395",
    description: "4 hours of training",
    features: [
      "Personalized programming",
      "Virtual or In Person",
      "Breathwork",
      "Meditation",
      "Async Q & A",
      "Video Support",
    ],
    package: "Individual - 4 Sessions",
  },
];

export const GROUP_OFFERINGS: OfferingType[] = [
  {
    title: "1 Session",
    price: "200",
    description: "1 hour of training",
    features: [
      "Unique programming for your group",
      "Virtual or In Person",
      "Breathwork",
      "Meditation",
    ],
    package: "Group - 1 Session",
  },
  {
    title: "4 Sessions",
    price: "700",
    description: "4 hours of training",
    features: [
      "Unique programming for your group",
      "Virtual or In Person",
      "Breathwork",
      "Meditation",
      "Async Q & A",
      "Video Support",
      "Sound Bath",
    ],
    package: "Group - 4 Sessions",
  },
];

export const ALL_OFFERINGS: OfferingType[] = [
  ...INDIVIDUAL_OFFERINGS,
  ...GROUP_OFFERINGS,
];

export const INDIVIDUAL: SessionType = "Individual";

export const GROUP: SessionType = "Group";
