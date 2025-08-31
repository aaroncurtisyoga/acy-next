"use client";

import { ReactNode } from "react";
import Footer from "@/app/_components/Footer";
import Header from "@/app/_components/Header/Header";
import "@/app/globals.css";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className={"flex flex-col min-h-dvh bg-white dark:bg-[#0a0a0a]"}>
      <Header />
      <main className={"grow bg-white dark:bg-[#0a0a0a]"}>{children}</main>
      <Footer />
    </div>
  );
}
