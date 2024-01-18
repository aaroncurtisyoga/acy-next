"use client";

import { usePathname } from "next/navigation";
import Image from "next/image";
import { cn } from "@/lib/utils";

import Header from "@/components/shared/Header";
import handstandPicture from "@/public/images/HandstandScissorLeg.png";
import "@/app/globals.css";

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isEventsPage = pathname.includes("events");
  return (
    <div className={"flex flex-col h-dvh"}>
      <Header />
      <main
        className={cn(
          "transition-all duration-150 grow grid md:grid-cols-[1fr,1fr] 11rem)] w-full max-w-screen-2xl lg:mx-auto",
          {
            "md:grid-cols-[1fr,6fr] 11rem)]": isEventsPage,
          },
        )}
      >
        <section className={"hidden md:block  md:relative"}>
          <Image
            alt="Handstand"
            className="object-cover"
            fill={true}
            sizes="(min-width: 1640px) 768px, calc(45vw + 39px)"
            priority={true}
            placeholder={"blur"}
            loading="eager"
            src={handstandPicture}
          />
        </section>
        {children}
      </main>
    </div>
  );
}
