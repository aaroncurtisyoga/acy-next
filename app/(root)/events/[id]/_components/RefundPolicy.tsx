import { FC } from "react";
import { instructorEmailAddress } from "@/app/_lib/constants";
const RefundPolicy: FC = () => {
  return (
    <div className={"mb-6 md:mb-8"}>
      <h2 className={"text-2xl font-bold mb-3"}>Refund Policy</h2>
      <p>
        In order to receive a refund, please{" "}
        <a
          href={`mailto:${instructorEmailAddress}`}
          className="text-primary hover:underline"
        >
          send me an email
        </a>
        , and I&lsquo;ll provide a 100% refund. No questions asked.
      </p>
    </div>
  );
};

export default RefundPolicy;
