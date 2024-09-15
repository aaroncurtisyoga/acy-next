"use client";

import React, { FC, useState } from "react";
import { Link, RadioGroup } from "@nextui-org/react";
import SelectTypeOfPrivateSession from "@/app/(root)/private-sessions/_components/SelectTypeOfPrivateSession";
import PrivateSessionOfferings from "@/app/(root)/private-sessions/_components/PrivateSessionOfferings";
import { INDIVIDUAL } from "@/app/(root)/private-sessions/_lib/constants";
import { SessionType } from "@/app/(root)/private-sessions/_lib/types";
import CheckoutButton from "@/app/(root)/private-sessions/_components/CheckoutButton";

const PrivateSessions: FC = () => {
  const [privateSessionType, setPrivateSessionType] =
    useState<SessionType>(INDIVIDUAL);
  const [selectedPackage, setSelectedPackage] = useState<String | null>(null);

  return (
    <section className={""}>
      <RadioGroup
        onValueChange={(value) => {
          setSelectedPackage(value);
        }}
        className={"mb-12"}
        label={
          <h1
            className={
              "text-center text-4xl font-bold mb-2 mt-12" + " tracking-tight"
            }
          >
            Train With Me
          </h1>
        }
        description={
          <p className={"text-center mt-3"}>
            Select the type of private session you&apos;d like to book.
          </p>
        }
      >
        <p className={"text-gray-500 max-w-xl text-center mx-auto mb-5"}>
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
        <SelectTypeOfPrivateSession
          setPrivateSessionType={setPrivateSessionType}
        />
        <PrivateSessionOfferings privateSessionType={privateSessionType} />
      </RadioGroup>
      <CheckoutButton selectedPackage={selectedPackage} />
    </section>
  );
};

export default PrivateSessions;
