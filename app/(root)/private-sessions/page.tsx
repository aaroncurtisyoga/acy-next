"use client";

import { FC, useState } from "react";
import SelectTypeOfPrivateSession from "@/app/(root)/private-sessions/_components/SelectTypeOfPrivateSession";
import { INDIVIDUAL } from "@/app/(root)/private-sessions/constants";
import { SessionType } from "@/app/(root)/private-sessions/types";
import PrivateSessionOfferings from "@/app/(root)/private-sessions/_components/PrivateSessionOfferings";

const PrivateSessions: FC = () => {
  const [privateSessionType, setPrivateSessionType] =
    useState<SessionType>(INDIVIDUAL);

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
          <a href="https://www.instagram.com/aaroncurtisyoga/">reach out</a>—I
          look forward to working with you!
        </p>
      </div>
      <SelectTypeOfPrivateSession
        setPrivateSessionType={setPrivateSessionType}
      />
      <PrivateSessionOfferings privateSessionType={privateSessionType} />
    </section>
  );
};

export default PrivateSessions;
