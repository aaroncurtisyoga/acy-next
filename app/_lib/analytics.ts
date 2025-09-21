import { track } from "@vercel/analytics";

// Enhanced conversion tracking utilities
export const trackConversion = (
  eventName: string,
  value?: number,
  currency?: string,
  properties?: Record<string, any>,
) => {
  track(eventName, {
    ...properties,
    value,
    currency: currency || "USD",
    timestamp: new Date().toISOString(),
  });
};

// E-commerce specific tracking
export const trackPurchase = (
  orderId: string,
  value: number,
  items: Array<{
    item_id: string;
    item_name: string;
    category: string;
    quantity: number;
    price: number;
  }>,
) => {
  trackConversion("purchase", value, "USD", {
    order_id: orderId,
    items,
    num_items: items.length,
  });
};

// Event registration tracking
export const trackEventRegistration = (
  eventId: string,
  eventTitle: string,
  category: string,
  isFree: boolean,
  registrationMethod: "external" | "internal",
) => {
  trackConversion("event_registration", isFree ? 0 : undefined, "USD", {
    event_id: eventId,
    event_title: eventTitle,
    category,
    is_free: isFree,
    registration_method: registrationMethod,
  });
};

// Newsletter subscription tracking
export const trackNewsletterSignup = (source: string) => {
  trackConversion("newsletter_signup", undefined, undefined, {
    source,
  });
};

// Private session booking tracking
export const trackPrivateSessionBooking = (
  sessionType: string,
  sessionCount: number,
  totalValue: number,
) => {
  trackConversion("private_session_booking", totalValue, "USD", {
    session_type: sessionType,
    session_count: sessionCount,
    average_session_price: totalValue / sessionCount,
  });
};

// Page engagement tracking
export const trackPageEngagement = (
  pageName: string,
  timeOnPage: number,
  scrollDepth: number,
) => {
  track("page_engagement", {
    page_name: pageName,
    time_on_page_seconds: Math.round(timeOnPage / 1000),
    scroll_depth_percent: Math.round(scrollDepth * 100),
  });
};

// Form completion tracking
export const trackFormCompletion = (
  formName: string,
  stepNumber?: number,
  totalSteps?: number,
) => {
  track("form_completion", {
    form_name: formName,
    step_number: stepNumber,
    total_steps: totalSteps,
    completion_rate: stepNumber && totalSteps ? stepNumber / totalSteps : 1,
  });
};

// Error tracking
export const trackError = (
  errorType: string,
  errorMessage: string,
  context?: Record<string, any>,
) => {
  track("error", {
    error_type: errorType,
    error_message: errorMessage,
    ...context,
  });
};
