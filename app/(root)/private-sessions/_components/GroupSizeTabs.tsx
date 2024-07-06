"use client";

import React, { FC } from "react";
import { Tab, Tabs } from "@nextui-org/tabs";
import { SessionType } from "@/app/(root)/private-sessions/types";
import { INDIVIDUAL, GROUP } from "@/app/(root)/private-sessions/constants";

interface GroupSizeTabsProps {
  setPrivateSessionType: (value: SessionType) => void;
}

const GroupSizeTabs: FC<GroupSizeTabsProps> = ({ setPrivateSessionType }) => {
  return (
    <Tabs
      color="primary"
      aria-label="Tabs colors"
      radius="md"
      size={"lg"}
      className={"mb-6 mx-auto max-w-xl"}
      classNames={{
        tab: "font-sm min-w-[120px]",
      }}
      onSelectionChange={(key: SessionType) => {
        setPrivateSessionType(key);
      }}
    >
      <Tab key={INDIVIDUAL} title="Individual" />
      <Tab key={GROUP} title="Group" />
    </Tabs>
  );
};

export default GroupSizeTabs;
