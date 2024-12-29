import { FC, PropsWithChildren } from "react";
import Header from "@/app/_components/Header";
import SidebarMenu from "@/app/admin/_components/SidebarMenu";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin",
};
const Layout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className={"flex flex-col min-h-dvh"}>
      <Header />
      <div className={"flex min-h-screen"}>
        <div className="w-64 bg-gray-100">
          <SidebarMenu />
        </div>
        <div className="flex-grow"> {children} </div>
      </div>
    </div>
  );
};

export default Layout;
