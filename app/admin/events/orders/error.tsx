"use client";

import Error from "@/app/_components/Error";

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
