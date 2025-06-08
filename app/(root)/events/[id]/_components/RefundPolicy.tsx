import { FC } from "react";
import { Link as HeroUiLink } from "@heroui/react";
import { instructorEmailAddress } from "@/app/_lib/constants";
const RefundPolicy: FC = () => {
  return (
    <div className={"mb-6 md:mb-8"}>
      <h2 className={"text-2xl font-bold mb-3"}>Refund Policy</h2>
      <p>
        In order to receive a refund, please{" "}
        <HeroUiLink href={`mailto:${instructorEmailAddress}`} underline="hover">
          send me an email
        </HeroUiLink>
        , and I&lsquo;ll provide a 100% refund. No questions asked.
      </p>
    </div>
  );
};

export default RefundPolicy;
