import { PropsWithChildren } from "react";
import SimpleNav from "@/app/(auth)/_components/SimpleNav";

const Layout = ({ children }: PropsWithChildren<{}>) => {
  return (
    <div className="flex flex-col min-h-dvh">
      <SimpleNav />
      <main className={"grow flex justify-center items-center px-4"}>
        {children}
      </main>
    </div>
  );
};

export default Layout;
