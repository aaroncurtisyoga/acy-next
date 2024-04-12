"use client";

import Error from "@/components/shared/Error";

export default function ErrorBoundary() {
  return (
    <Error>
      <h1 className={"error-headline"}>
        Whoops, we are having trouble loading the Order page. Please try again
        later.
      </h1>
    </Error>
  );
}
