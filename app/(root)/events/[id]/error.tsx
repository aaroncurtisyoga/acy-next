"use client";

import { Link as NextUiLink } from "@nextui-org/link";
import Error from "@/components/shared/Error";
import { instructorEmailAddress } from "@/constants";

export default function ErrorBoundary() {
  return (
    <Error>
      <h1 className={"error-headline"}>
        Whoops, the page or event you are looking for was not found.
      </h1>
      <p className={"error-subHeadline"}>
        If you feel this message is in error, please{" "}
        <NextUiLink
          isExternal
          underline={"hover"}
          className={"text-xl md:text-2xl"}
          href={`mailto:${instructorEmailAddress}`}
        >
          let us know.
        </NextUiLink>
      </p>
    </Error>
  );
}
