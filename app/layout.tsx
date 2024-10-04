import { ReactNode } from "react";
import { Analytics } from "@vercel/analytics/react";
import type { Metadata } from "next";
import { robotoFlex } from "@/app/fonts";
import { Providers } from "@/app/providers";
import "./globals.css";

export const metadata: Metadata = {
  title: { template: "%s | Aaron Curtis Yoga", default: "Aaron Curtis Yoga" },
  description: "Yoga Events & Education",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={`${robotoFlex.className}`}>
        <Providers>
          {children}
          <Analytics />
        </Providers>
      </body>
    </html>
  );
}
