"use client";

import Error from "@/app/_components/Error";
import { instructorEmailAddress } from "@/app/_lib/constants";
import { Button } from "@heroui/react";
import { Link as HeroUiLink } from "@heroui/link";

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
            <HeroUiLink
              isExternal
              underline={"hover"}
              className={"text-xl md:text-2xl"}
              href={`mailto:${instructorEmailAddress}`}
            >
              let us know.
            </HeroUiLink>
          </p>
          <Button onPress={() => reset()}>Try to refresh</Button>
        </Error>
      </body>
    </html>
  );
}
