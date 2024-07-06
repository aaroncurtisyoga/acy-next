import { OfferingType, SessionType } from "@/app/(root)/private-sessions/types";

export const INDIVIDUAL_OFFERINGS: OfferingType[] = [
  {
    title: "1 Session",
    price: "$125",
    description: "1 hour of training",
    includes: [
      "Personalized programming",
      "Virtual or In Person",
      "Breathwork",
      "Meditation",
    ],
  },
  {
    title: "4 Sessions",
    price: "$450",
    description: "4 hours of training",
    includes: [
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
    includes: [
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
    includes: [
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
