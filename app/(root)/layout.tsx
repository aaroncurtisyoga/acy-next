import { ReactNode } from "react";
import HeaderOld from "@/components/shared/HeaderOld";
import Footer from "@/components/shared/Footer";
import "@/app/globals.css";
import Image from "next/image";
import handstandPicture from "@/public/assets/images/ScissorHandstand_LowRes-min.jpg";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className={"flex flex-col min-h-dvh"}>
      <HeaderOld />
      <main className={"grow grid w-full"}>
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
