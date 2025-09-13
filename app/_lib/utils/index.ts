import qs from "query-string";
import { RemoveUrlQueryParams, UrlQueryParams } from "@/app/_lib/types";

export const formatDateTime = (dateInput: Date | string) => {
  // Handle different input types - convert to Date object
  let dateString: Date;
  if (typeof dateInput === "string") {
    dateString = new Date(dateInput);
  } else {
    dateString = dateInput;
  }

  // Validate that we have a valid date
  if (isNaN(dateString.getTime())) {
    console.error("Invalid date provided to formatDateTime:", dateInput);
    // Return fallback values for invalid dates
    return {
      dateTime: "Invalid Date",
      dateOnly: "Invalid Date",
      dateOnlyWithoutYear: "Invalid Date",
      dateLongWithoutYear: "Invalid Date",
      timeOnly: "Invalid Time",
      monthYear: "Invalid Date",
      monthShort: "N/A",
      monthLong: "N/A",
      dayNumber: 0,
      year: 0,
      weekdayShort: "N/A",
      weekdayLong: "N/A",
    };
  }
  const dateTimeOptions: Intl.DateTimeFormatOptions = {
    weekday: "short", // abbreviated weekday name (e.g., 'Mon')
    month: "short", // abbreviated month name (e.g., 'Oct')
    day: "numeric", // numeric day of the month (e.g., '25')
    hour: "numeric", // numeric hour (e.g., '8')
    minute: "numeric", // numeric minute (e.g., '30')
    hour12: true, // use 12-hour clock (true) or 24-hour clock (false)
    timeZone: "America/New_York", // Force EST/EDT timezone
  };

  const dateOptions: Intl.DateTimeFormatOptions = {
    weekday: "short",
    month: "short",
    year: "numeric",
    day: "numeric",
    timeZone: "America/New_York",
  };

  const dateOptionsWithoutYear: Intl.DateTimeFormatOptions = {
    weekday: "short",
    month: "long",
    day: "numeric",
    timeZone: "America/New_York",
  };

  const dateOptionsLongWithoutYear: Intl.DateTimeFormatOptions = {
    weekday: "long",
    month: "long",
    day: "numeric",
    timeZone: "America/New_York",
  };

  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
    timeZone: "America/New_York", // Force EST/EDT timezone for display
  };

  const monthYearOptions: Intl.DateTimeFormatOptions = {
    month: "long",
    year: "numeric",
    timeZone: "America/New_York",
  };

  const formattedDateTime: string = new Date(dateString).toLocaleString(
    "en-US",
    dateTimeOptions,
  );

  const formattedDate: string = new Date(dateString).toLocaleString(
    "en-US",
    dateOptions,
  );

  const formattedDateWithoutYear: string = new Date(dateString).toLocaleString(
    "en-US",
    dateOptionsWithoutYear,
  );

  const formattedDateLongWithoutYear: string = new Date(
    dateString,
  ).toLocaleString("en-US", dateOptionsLongWithoutYear);

  const formattedTime: string = new Date(dateString).toLocaleString(
    "en-US",
    timeOptions,
  );

  const formattedMonthYear: string = new Date(dateString).toLocaleString(
    "en-US",
    monthYearOptions,
  );

  // Additional formatted parts - use EST/EDT timezone
  const date = new Date(dateString);
  const monthShort = date
    .toLocaleDateString("en-US", {
      month: "short",
      timeZone: "America/New_York",
    })
    .toUpperCase();
  const monthLong = date.toLocaleDateString("en-US", {
    month: "long",
    timeZone: "America/New_York",
  });
  const dayNumber = parseInt(
    date.toLocaleDateString("en-US", {
      day: "numeric",
      timeZone: "America/New_York",
    }),
  );
  const year = parseInt(
    date.toLocaleDateString("en-US", {
      year: "numeric",
      timeZone: "America/New_York",
    }),
  );
  const weekdayShort = date.toLocaleDateString("en-US", {
    weekday: "short",
    timeZone: "America/New_York",
  });
  const weekdayLong = date.toLocaleDateString("en-US", {
    weekday: "long",
    timeZone: "America/New_York",
  });

  return {
    dateTime: formattedDateTime,
    dateOnly: formattedDate,
    dateOnlyWithoutYear: formattedDateWithoutYear,
    dateLongWithoutYear: formattedDateLongWithoutYear,
    timeOnly: formattedTime,
    monthYear: formattedMonthYear,
    monthShort,
    monthLong,
    dayNumber,
    year,
    weekdayShort,
    weekdayLong,
  };
};

export const formatPrice = (price: string) => {
  const amount = parseFloat(price);
  const formattedPrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);

  return formattedPrice;
};

export function formUrlQuery({ params, key, value }: UrlQueryParams) {
  const currentUrl = qs.parse(params);

  currentUrl[key] = value;

  return qs.stringifyUrl(
    {
      url: window.location.pathname,
      query: currentUrl,
    },
    { skipNull: true },
  );
}

export function removeKeysFromQuery({
  params,
  keysToRemove,
}: RemoveUrlQueryParams) {
  const currentUrl = qs.parse(params);

  keysToRemove.forEach((key) => {
    delete currentUrl[key];
  });

  return qs.stringifyUrl(
    {
      url: window.location.pathname,
      query: currentUrl,
    },
    { skipNull: true },
  );
}

export const handleError = (error: unknown, _message?: unknown) => {
  console.error(error);
  throw new Error(typeof error === "string" ? error : JSON.stringify(error));
};

// Re-export utilities
export * from "./pagination";
export * from "./query-builders";
export * from "./error-handling";
export * from "./api-response";
export * from "./validation";

export const isDate = (date: any): date is Date => {
  return date instanceof Date;
};
