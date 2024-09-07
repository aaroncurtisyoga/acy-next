"use client";

import React, { FC, useState } from "react";
import { Link } from "@nextui-org/react";
import SelectTypeOfPrivateSession from "@/app/(root)/private-sessions/_components/SelectTypeOfPrivateSession";
import PrivateSessionOfferings from "@/app/(root)/private-sessions/_components/PrivateSessionOfferings";
import { INDIVIDUAL } from "@/app/(root)/private-sessions/_lib/constants";
import {
  OfferingType,
  SessionType,
} from "@/app/(root)/private-sessions/_lib/types";
import CheckoutButton from "@/app/(root)/private-sessions/_components/CheckoutButton";

const PrivateSessions: FC = () => {
  const [privateSessionType, setPrivateSessionType] =
    useState<SessionType>(INDIVIDUAL);
  const [selectedPackage, setSelectedPackage] = useState<OfferingType | null>(
    null,
  );

  return (
    <section className={"wrapper flex flex-col"}>
      <div className="max-w-xl mx-auto mb-12">
        <h1
          className={"text-4xl font-bold mb-3 text-center mt-12 tracking-tight"}
        >
          Train With Me
        </h1>
        <p className={"text-center text-gray-500"}>
          Private sessions allow me to connect with you on a personal level,
          focusing on your unique needs. Whether we&apos;re working on specific
          postures, meditation, improving movement, or mentoring for teaching,
          my goal is to share everything I’ve learned to help you achieve your
          goals. If you have any questions, please{" "}
          <Link
            isExternal
            underline={"always"}
            href="https://www.instagram.com/aaroncurtisyoga/"
          >
            reach out
          </Link>
          —I look forward to working with you!
        </p>
      </div>
      <SelectTypeOfPrivateSession
        setPrivateSessionType={setPrivateSessionType}
      />
      <PrivateSessionOfferings privateSessionType={privateSessionType} />
      <CheckoutButton />
    </section>
  );
};

export default PrivateSessions;
