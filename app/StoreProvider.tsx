"use client";

import { PropsWithChildren, useRef } from "react";
import { Provider } from "react-redux";
import { makeStore } from "@/app/_lib/redux/store";
import type { AppStore } from "@/app/_lib//redux/store";

export const StoreProvider = ({ children }: PropsWithChildren<{}>) => {
  const storeRef = useRef<AppStore | null>(null);

  if (!storeRef.current) {
    // Create the store instance the first time this renders
    storeRef.current = makeStore();
  }

  return <Provider store={storeRef.current}>{children}</Provider>;
};
