"use client";

import { Link as NextUiLink } from "@nextui-org/link";
import { Button } from "@nextui-org/react";
import Error from "@/app/_components/Error";
import { instructorEmailAddress } from "@/app/_lib/constants";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <Error>
          <h1 className={"error-headline"}>
            Sorry, it seems like the app is having trouble loading right now.
          </h1>
          <p className={"error-subHeadline"}>
            If you would like to try refreshing the page, please click the
            button below. If the issue persists, please{" "}
            <NextUiLink
              isExternal
              underline={"hover"}
              className={"text-xl md:text-2xl"}
              href={`mailto:${instructorEmailAddress}`}
            >
              let us know.
            </NextUiLink>
          </p>
          <Button onClick={() => reset()}>Try to refresh</Button>
        </Error>
      </body>
    </html>
  );
}
