import "@/app/globals.css";
import { Poppins } from "next/font/google";
import Header from "@/components/shared/Header";
import Image from "next/image";
import handstandPicture from "../public/images/HandstandScissorLeg.png";
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
});
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} antialiased flex flex-col h-dvh`}>
        <Header />
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
          {children}
        </main>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
