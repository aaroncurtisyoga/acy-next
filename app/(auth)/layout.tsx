import { ReactNode } from "react";
import Footer from "@/components/shared/Footer";
import Header from "@/components/shared/Header";

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex flex-col justify-center items-center min-h-screen w-full">
      <Header isSimpleNav={true} />
      {children}
      <Footer />
    </div>
  );
};

export default Layout;
