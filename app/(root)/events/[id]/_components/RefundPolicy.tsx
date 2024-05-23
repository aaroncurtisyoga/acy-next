import { FC } from "react";
import { Link as NextUiLink } from "@nextui-org/react";
import { instructorEmailAddress } from "@/_lib/constants";
const RefundPolicy: FC = () => {
  return (
    <div className={"mb-6 md:mb-8"}>
      <h2 className={"text-2xl font-bold mb-3"}>Refund Policy</h2>
      <p>
        In order to receive a refund, please{" "}
        <NextUiLink href={`mailto:${instructorEmailAddress}`} underline="hover">
          send me an email
        </NextUiLink>
        , and I&lsquo;ll provide a 100% refund. No questions asked.
      </p>
    </div>
  );
};

export default RefundPolicy;
