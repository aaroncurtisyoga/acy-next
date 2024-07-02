"use client";

import React, { FC } from "react";
import PurchaseCard from "@/app/(root)/private-sessions/_components/PurchaseCard";
import { Tab, Tabs } from "@nextui-org/tabs";

const PrivateSessions: FC = () => {
  return (
    <section className={"wrapper flex flex-col"}>
      <div className="max-w-xl mx-auto mb-14">
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
      <Tabs
        color="primary"
        aria-label="Tabs colors"
        radius="md"
        size={"lg"}
        className={"mb-6 mx-auto max-w-xl"}
        classNames={{
          tab: "font-sm min-w-[120px]",
        }}
      >
        <Tab key="individual" title="Individual" />
        <Tab key="group" title="Group" />
      </Tabs>
      <PurchaseCard />
    </section>
  );
};

export default PrivateSessions;
