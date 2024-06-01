import type { Metadata } from "next";
import { FC, PropsWithChildren } from "react";
import Header from "@/_components/Header";
import Menu from "@/app/admin/_components/Menu";

export const metadata: Metadata = {
  title: "Admin",
};
const Layout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className={"flex flex-col min-h-dvh"}>
      <Header />
      <div className={"flex min-h-screen"}>
        <div className="w-64 bg-gray-200">
          <Menu />
        </div>
        <div className="flex-grow"> {children} </div>
      </div>
    </div>
  );
};

export default Layout;
