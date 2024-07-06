"use client";

import React, { FC } from "react";
import { Tab, Tabs } from "@nextui-org/tabs";
import { PrivateSessionType } from "@/app/(root)/private-sessions/types";
import {
  SESSION_FOR_INDIVIDUAL,
  SESSION_FOR_GROUP,
} from "@/app/(root)/private-sessions/constants";

interface GroupSizeTabsProps {
  setPrivateSessionType: (value: PrivateSessionType) => void;
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
      onSelectionChange={(key: PrivateSessionType) => {
        setPrivateSessionType(key);
      }}
    >
      <Tab key={SESSION_FOR_INDIVIDUAL} title="Individual" />
      <Tab key={SESSION_FOR_GROUP} title="Group" />
    </Tabs>
  );
};

export default GroupSizeTabs;
