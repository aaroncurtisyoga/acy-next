import React from "react";

import "./ui/global.scss";
import HeroImage from "./ui/home/hero-image";
import { inter } from "./ui/fonts";
import Nav from "./ui/home/nav";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <Nav />
        <main>
          <HeroImage />
          {children}
        </main>
      </body>
    </html>
  );
}
