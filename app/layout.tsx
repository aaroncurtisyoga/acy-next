import { ReactNode } from "react";
import { Analytics } from "@vercel/analytics/react";
import { robotoFlex } from "@/app/fonts";
import { Providers } from "@/app/providers";
import type { Metadata, Viewport } from "next";
import "./globals.css";

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
      <body className={`${robotoFlex.className}`} suppressHydrationWarning>
        <Providers>
          {children}
          <Analytics />
        </Providers>
      </body>
    </html>
  );
}
