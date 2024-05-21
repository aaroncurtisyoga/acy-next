"use client";

import Error from "@/components/Error";

export default function ErrorBoundary() {
  return (
    <Error>
      <h1 className={"error-headline"}>
        Whoops, we are having trouble creating your event. Please try again.
      </h1>
    </Error>
  );
}
