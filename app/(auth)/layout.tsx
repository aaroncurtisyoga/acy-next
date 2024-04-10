import { PropsWithChildren } from "react";
import Header from "@/components/shared/Header";

const Layout = ({ children }: PropsWithChildren<{}>) => {
  return (
    <div className="flex flex-col min-h-dvh">
      <Header isSimpleNav={true} />
      <main className={"grow flex justify-center items-center"}>
        {children}
      </main>
    </div>
  );
};

export default Layout;
