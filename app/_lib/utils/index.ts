import qs from "query-string";
import { RemoveUrlQueryParams, UrlQueryParams } from "@/app/_lib/types";

export const formatDateTime = (dateString: Date) => {
  const dateTimeOptions: Intl.DateTimeFormatOptions = {
    weekday: "short", // abbreviated weekday name (e.g., 'Mon')
    month: "short", // abbreviated month name (e.g., 'Oct')
    day: "numeric", // numeric day of the month (e.g., '25')
    hour: "numeric", // numeric hour (e.g., '8')
    minute: "numeric", // numeric minute (e.g., '30')
    hour12: true, // use 12-hour clock (true) or 24-hour clock (false)
  };

  const dateOptions: Intl.DateTimeFormatOptions = {
    weekday: "short",
    month: "short",
    year: "numeric",
    day: "numeric",
  };

  const dateOptionsWithoutYear: Intl.DateTimeFormatOptions = {
    weekday: "short",
    month: "long",
    day: "numeric",
  };

  const dateOptionsLongWithoutYear: Intl.DateTimeFormatOptions = {
    weekday: "long",
    month: "long",
    day: "numeric",
  };

  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  };

  const monthYearOptions: Intl.DateTimeFormatOptions = {
    month: "long",
    year: "numeric",
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

  // Additional formatted parts
  const date = new Date(dateString);
  const monthShort = date
    .toLocaleDateString("en-US", { month: "short" })
    .toUpperCase();
  const monthLong = date.toLocaleDateString("en-US", { month: "long" });
  const dayNumber = date.getDate();
  const year = date.getFullYear();
  const weekdayShort = date.toLocaleDateString("en-US", { weekday: "short" });
  const weekdayLong = date.toLocaleDateString("en-US", { weekday: "long" });

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
