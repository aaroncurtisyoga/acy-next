"use client";

import { Link as HeroUiLink } from "@heroui/react";
import Error from "@/app/_components/Error";
import { instructorEmailAddress } from "@/app/_lib/constants";

export default function ErrorBoundary() {
  return (
    <Error>
      <h1 className={"error-headline"}>
        Whoops, the page or event you are looking for was not found.
      </h1>
      <p className={"error-subHeadline"}>
        If you feel this message is in error, please{" "}
        <HeroUiLink
          isExternal
          underline={"hover"}
          className={"text-xl md:text-2xl"}
          href={`mailto:${instructorEmailAddress}`}
        >
          let us know.
        </HeroUiLink>
      </p>
    </Error>
  );
}
