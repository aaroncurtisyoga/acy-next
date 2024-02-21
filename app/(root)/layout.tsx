import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";
import "@/app/globals.css";
import Image from "next/image";
import handstandPicture from "@/public/handstand.jpg";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <Header />
      <main>
        <div>
          <Image
            alt="Yoga posture hand to big toe"
            // className="object-cover"
            fill={true}
            sizes="(min-width: 1640px) 768px, calc(45vw + 39px)"
            priority={true}
            placeholder={"blur"}
            loading="eager"
            src={handstandPicture}
          />
          {children}
        </div>
      </main>
      <Footer />
    </div>
  );
}
