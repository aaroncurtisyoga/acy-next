import Image from "next/image";
import handstandPicture from "@/public/assets/images/ScissorHandstand_LowRes-min.jpg";
import AboutLinks from "@/components/shared/AboutLinks";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <main
        className={
          "grow grid md:grid-cols-[1fr,1fr] 11rem)] w-full max-w-screen-2xl lg:mx-auto"
        }
      >
        <section className={"hidden md:block  md:relative"}>
          <Image
            alt="Yoga posture hand to big toe"
            className="object-cover"
            fill={true}
            sizes="(min-width: 1640px) 768px, calc(45vw + 39px)"
            priority={true}
            placeholder={"blur"}
            loading="eager"
            src={handstandPicture}
          />
        </section>
        <div className={"p-6 md:p-8"}>
          <AboutLinks />
          {children}
        </div>
      </main>
    </>
  );
}
