"use client";

import { FC } from "react";
import { Tabs, Tab } from "@heroui/tabs";
import {
  GROUP,
  INDIVIDUAL,
} from "@/app/(root)/private-sessions/_lib/constants";
import { SessionType } from "@/app/(root)/private-sessions/_lib/types";

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
      size="lg"
      className="mb-6 mx-auto flex justify-center"
      classNames={{
        tab: "font-sm min-w-[120px]",
        tabList: "justify-center",
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
