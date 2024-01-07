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
        <main
          className={
            "grid md:grid-cols-[1fr,1fr] h-[calc(100vh-64px)] max-w-screen-2xl lg:mx-auto"
          }
        >
          <section className={"hidden md:block  md:relative"}>
            <Image
              alt="Yoga posture hand to big toe"
              className="object-cover"
              fill={true}
              sizes={"(min-width: 768px) 50vw, 0vw"}
              priority={true}
              loading="eager"
              src="/images/ScissorHandstand_LowRes-min.jpg"
            />
          </section>
          {children}
        </main>
      </body>
    </html>
  );
}
