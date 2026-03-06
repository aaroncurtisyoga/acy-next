"use client";

import { FC } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
      defaultValue={INDIVIDUAL}
      onValueChange={(value) => setPrivateSessionType(value as SessionType)}
      className="mb-6 mx-auto flex justify-center"
    >
      <TabsList className="h-10">
        <TabsTrigger value={INDIVIDUAL} className="min-w-[120px] text-sm">
          Individual
        </TabsTrigger>
        <TabsTrigger value={GROUP} className="min-w-[120px] text-sm">
          Group
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};

export default SelectTypeOfPrivateSession;
