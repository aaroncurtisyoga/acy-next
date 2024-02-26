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
      <main className={"grow grid w-full max-w-7xl"}>
        <div>
          {/*<Image
            alt="Yoga posture hand to big toe"
            // className="object-cover"
            fill={true}
            sizes="(min-width: 1640px) 768px, calc(45vw + 39px)"
            priority={true}
            placeholder={"blur"}
            loading="eager"
            src={handstandPicture}
          />*/}
          {children}
        </div>
      </main>
      <Footer />
    </div>
  );
}
