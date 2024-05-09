"use client";

import { PropsWithChildren, useRef } from "react";
import { makeStore } from "@/lib/redux/store";
import { Provider } from "react-redux";
import type { AppStore } from "@/lib//redux/store";

export const StoreProvider = ({ children }: PropsWithChildren<{}>) => {
  const storeRef = useRef<AppStore | null>(null);

  if (!storeRef.current) {
    // Create the store instance the first time this renders
    storeRef.current = makeStore();
  }

  return <Provider store={storeRef.current}>{children}</Provider>;
};
