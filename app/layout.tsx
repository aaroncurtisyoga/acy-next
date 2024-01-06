import "@/app/globals.css";
import { Poppins } from "next/font/google";
import Header from "@/components/shared/Header";
import Image from "next/image";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} antialiased`}>
        <Header />
        <main className={"grid grid-cols-[1fr,1fr] h-[calc(100vh-64px)]"}>
          <section className={"relative"}>
            <Image
              alt="Yoga posture hand to big toe"
              className=""
              fill={true}
              priority={true}
              objectFit={"cover"}
              layout={"raw"}
              loading="eager"
              src="/images/042321_YogaPose_HandToBigToe.jpg"
            />
          </section>
          {children}
        </main>
      </body>
    </html>
  );
}
