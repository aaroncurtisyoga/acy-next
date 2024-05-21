import { ReactNode } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
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
