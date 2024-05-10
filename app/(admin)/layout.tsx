import type { Metadata } from "next";
import { ReactNode } from "react";
import Header from "@/components/shared/Header";

export const metadata: Metadata = {
  title: "Admin",
};
const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <div className={"flex flex-col min-h-dvh"}>
      <Header />
      {children}
    </div>
  );
};

export default Layout;
