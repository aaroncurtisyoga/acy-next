import { ReactNode } from "react";
import { Analytics } from "@vercel/analytics/react";
import { Merriweather, Roboto_Flex } from "next/font/google";
import { Providers } from "@/app/providers";
import type { Metadata, Viewport } from "next";
import "./globals.css";

const robotoFlex = Roboto_Flex({
  subsets: ["latin"],
  variable: "--font-roboto-flex",
});

const merriweather = Merriweather({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-merriweather",
});

export const metadata: Metadata = {
  title: {
    template: "%s | Aaron Curtis Yoga",
    default: "Aaron Curtis Yoga",
  },
  description: "Yoga Events & Education",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${robotoFlex.variable} ${merriweather.variable} font-sans`}
        suppressHydrationWarning
      >
        <Providers>
          {children}
          <Analytics />
        </Providers>
      </body>
    </html>
  );
}
