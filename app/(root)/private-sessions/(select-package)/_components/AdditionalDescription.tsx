import { FC } from "react";
import { Link as HeroUiLink } from "@heroui/link";

export const AdditionalDescription: FC = () => (
  <p className="text-gray-500 max-w-xl text-center mx-auto mb-5">
    Private sessions allow me to connect with you on a personal level, focusing
    on your unique needs. Whether we&apos;re working on specific postures,
    meditation, improving movement, or mentoring for teaching, my goal is to
    share everything I’ve learned to help you achieve your goals. If you have
    any questions, please{" "}
    <HeroUiLink
      isExternal
      underline={"always"}
      href="https://www.instagram.com/aaroncurtisyoga/"
    >
      reach out
    </HeroUiLink>
    —I look forward to working with you!
  </p>
);
