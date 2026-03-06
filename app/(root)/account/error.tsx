"use client";

import Error from "@/app/_components/Error";
import { instructorEmailAddress } from "@/app/_lib/constants";

export default function ErrorBoundary() {
  return (
    <Error>
      <h1 className={"error-headline"}>
        Whoops, the account information is not currently available.
      </h1>
      <h2 className={"error-subHeadline"}>
        If you feel this message is in error, please{" "}
        <a
          href={`mailto:${instructorEmailAddress}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xl md:text-2xl text-primary hover:underline"
        >
          let us know.
        </a>
      </h2>
    </Error>
  );
}
