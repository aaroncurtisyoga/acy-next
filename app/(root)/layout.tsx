"use client";

import { ReactNode } from "react";
import Footer from "@/app/_components/Footer";
import Header from "@/app/_components/Header/Header";
import "@/app/globals.css";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-[#0a0a0a]">
      <Header />
      <main className="flex-1 flex bg-white dark:bg-[#0a0a0a]">{children}</main>
      <Footer />
    </div>
  );
}
