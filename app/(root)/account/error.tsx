"use client";

import { Link as NextUiLink } from "@nextui-org/link";
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
        <NextUiLink
          isExternal
          underline={"hover"}
          className={"text-xl md:text-2xl"}
          href={`mailto:${instructorEmailAddress}`}
        >
          let us know.
        </NextUiLink>
      </h2>
    </Error>
  );
}
