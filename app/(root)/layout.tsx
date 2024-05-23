import { ReactNode } from "react";
import Header from "@/_components/Header";
import Footer from "@/_components/Footer";
import "@/app/globals.css";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className={"flex flex-col min-h-dvh"}>
      <Header />
      <main className={"grow"}>{children}</main>
      <Footer />
    </div>
  );
}
