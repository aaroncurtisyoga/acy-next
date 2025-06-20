import { SESSION_PRICING } from "./constants";
import { SessionType, SessionPurchase, OfferingType } from "./types";

// Legacy function for backward compatibility
export function getPackageDetails(
  packageName: string,
  allOfferings: OfferingType[],
): OfferingType | undefined {
  return allOfferings.find((offering) => offering.package === packageName);
}

export function calculateSessionPricing(
  sessionType: SessionType,
  sessionCount: number,
): SessionPurchase {
  const pricing = SESSION_PRICING[sessionType];
  const basePrice = pricing.basePrice;
  const baseTotal = basePrice * sessionCount;

  // Find applicable discount
  const applicableDiscount = pricing.discounts
    .filter((d) => sessionCount >= d.minSessions)
    .sort((a, b) => b.discount - a.discount)[0];

  if (applicableDiscount) {
    const discountAmount = baseTotal * applicableDiscount.discount;
    const totalPrice = baseTotal - discountAmount;
    const pricePerSession = totalPrice / sessionCount;

    return {
      sessionType,
      sessionCount,
      pricePerSession: Math.round(pricePerSession * 100) / 100,
      totalPrice: Math.round(totalPrice * 100) / 100,
      discount: {
        percentage: applicableDiscount.discount * 100,
        amount: Math.round(discountAmount * 100) / 100,
        label: applicableDiscount.label,
      },
    };
  }

  return {
    sessionType,
    sessionCount,
    pricePerSession: basePrice,
    totalPrice: baseTotal,
  };
}

export function getNextDiscountTier(
  sessionType: SessionType,
  currentCount: number,
) {
  const pricing = SESSION_PRICING[sessionType];
  return pricing.discounts.find((d) => d.minSessions > currentCount);
}
