"use client";

import { Tab, Tabs } from "@nextui-org/tabs";

const GroupSizeTabs = () => {
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
    >
      <Tab key="individual" title="Individual" />
      <Tab key="group" title="Group" />
    </Tabs>
  );
};

export default GroupSizeTabs;
