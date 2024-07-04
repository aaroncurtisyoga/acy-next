"use client";

import { FC, useState } from "react";
import GroupSizeTabs from "@/app/(root)/private-sessions/_components/GroupSizeTabs";
import {
  INDIVIDUAL_OFFERINGS,
  GROUP_OFFERINGS,
  PRIVATE_SESSION,
} from "@/app/(root)/private-sessions/constants";
import { PrivateSessionType } from "@/app/(root)/private-sessions/types";

const PrivateSessions: FC = () => {
  const [privateSessionType, setPrivateSessionType] =
    useState<PrivateSessionType>(PRIVATE_SESSION);

  return (
    <section className={"wrapper flex flex-col"}>
      <div className="max-w-xl mx-auto mb-12">
        <h1
          className={"text-4xl font-bold mb-3 text-center mt-12 tracking-tight"}
        >
          Train With Me
        </h1>
        <p className={"text-center text-gray-500"}>
          Whether you want to focus on a certain posture, or you&apos;re looking
          for support in various aspects of your yoga journey, you can schedule
          a single session or a group of sessions all catered towards your
          personal goals.
        </p>
      </div>
      <GroupSizeTabs setPrivateSessionType={setPrivateSessionType} />
      <div>
        {/*  {options.map((option, index) => (
          <PurchaseCard key={index} offering={option} />
        ))}*/}
      </div>
    </section>
  );
};

export default PrivateSessions;
