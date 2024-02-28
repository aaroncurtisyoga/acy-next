import Image from "next/image";
import { ReactNode } from "react";
import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";
import handstandPicture from "@/public/assets/images/ScissorHandstand_LowRes-min.jpg";
import "@/app/globals.css";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className={"flex flex-col min-h-dvh"}>
      <Header />
      <main className={"grow"}>
        <div>{children}</div>
      </main>
      <Footer />
    </div>
  );
}
