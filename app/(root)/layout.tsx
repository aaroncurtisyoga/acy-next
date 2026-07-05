"use client";

import { ReactNode } from "react";
import Footer from "@/app/_components/Footer";
import Header from "@/app/_components/Header/Header";
import "@/app/globals.css";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-dvh flex flex-col bg-white">
      <Header />
      <main className="flex-1 flex bg-white">{children}</main>
      <Footer />
    </div>
  );
}
