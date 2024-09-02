import { OfferingType, SessionType } from "@/app/(root)/private-sessions/types";

export const INDIVIDUAL_OFFERINGS: OfferingType[] = [
  {
    title: "1 Session",
    price: "$115",
    description: "1 hour of training",
    features: [
      "Personalized programming",
      "Virtual or In Person",
      "Breathwork",
      "Meditation",
    ],
  },
  {
    title: "4 Sessions",
    price: "$395",
    description: "4 hours of training",
    features: [
      "Personalized programming",
      "Virtual or In Person",
      "Breathwork",
      "Meditation",
      "Async Q & A",
      "Video Support",
    ],
  },
];

export const GROUP_OFFERINGS: OfferingType[] = [
  {
    title: "1 Session",
    price: "$200",
    description: "1 hour of training",
    features: [
      "Unique programming for your group",
      "Virtual or In Person",
      "Breathwork",
      "Meditation",
    ],
  },
  {
    title: "4 Sessions",
    price: "$700",
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
  },
];

export const INDIVIDUAL: SessionType = "Individual";

export const GROUP: SessionType = "Group";
