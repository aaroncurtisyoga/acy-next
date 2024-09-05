import type { Metadata } from "next";
import { ReactNode } from "react";
import { Analytics } from "@vercel/analytics/react";
import { Playfair_Display, Roboto_Flex } from "next/font/google";
import { Providers } from "@/app/providers";
import "./globals.css";

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
});
const robotoFlex = Roboto_Flex({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: { template: "%s | Aaron Curtis Yoga", default: "Aaron Curtis Yoga" },
  description: "Yoga Events & Education",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className={`${playfairDisplay.className} ${robotoFlex.className}`}
    >
      <body>
        <Providers>
          {children}
          <Analytics />
        </Providers>
      </body>
    </html>
  );
}
