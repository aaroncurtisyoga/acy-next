import { SessionType } from "@/app/(root)/private-sessions/_lib/types";

export const SESSION_PRICING = {
  Individual: {
    basePrice: 120, // per session
    discounts: [
      { minSessions: 3, discount: 0.05, label: "5% off" }, // $114/session
      { minSessions: 5, discount: 0.12, label: "12% off" }, // $105.60/session
      { minSessions: 8, discount: 0.18, label: "18% off" }, // $98.40/session
      { minSessions: 12, discount: 0.25, label: "25% off" }, // $90/session
      { minSessions: 20, discount: 0.3, label: "30% off" }, // $84/session
    ],
  },
  Group: {
    basePrice: 80, // per session per person
    discounts: [
      { minSessions: 3, discount: 0.05, label: "5% off" }, // $76/session
      { minSessions: 5, discount: 0.12, label: "12% off" }, // $70.40/session
      { minSessions: 8, discount: 0.18, label: "18% off" }, // $65.60/session
      { minSessions: 12, discount: 0.25, label: "25% off" }, // $60/session
      { minSessions: 20, discount: 0.3, label: "30% off" }, // $56/session
    ],
  },
};

export const MIN_SESSIONS = 1;
export const MAX_SESSIONS = 20;
export const POPULAR_SESSION_COUNTS = [3, 5, 8, 12];

export const INDIVIDUAL: SessionType = "Individual";
export const GROUP: SessionType = "Group";
