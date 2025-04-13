"use client";

import React, { FC } from "react";
import {
  GROUP,
  INDIVIDUAL,
} from "@/app/(root)/private-sessions/_lib/constants";
import { SessionType } from "@/app/(root)/private-sessions/_lib/types";
import { Tabs, Tab } from "@heroui/react";

interface GroupSizeTabsProps {
  setPrivateSessionType: (value: SessionType) => void;
}

const SelectTypeOfPrivateSession: FC<GroupSizeTabsProps> = ({
  setPrivateSessionType,
}) => {
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

export default SelectTypeOfPrivateSession;
