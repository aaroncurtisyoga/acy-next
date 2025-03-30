// app/(root)/private-sessions/layout.tsx
"use client";

import { ReactNode } from "react";
import { WizardProvider } from "@/app/(root)/private-sessions/_context/FormContext";
import Footer from "@/app/_components/Footer";
import Header from "@/app/_components/Header/Header";
import { WizardLayout } from "@/app/(root)/private-sessions/_components/WizardLayout";
import "@/app/globals.css";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className={"flex flex-col min-h-dvh"}>
      <Header />
      <main className={"grow"}>
        <WizardProvider>
          <WizardLayout>{children}</WizardLayout>
        </WizardProvider>
      </main>
      <Footer />
    </div>
  );
}
