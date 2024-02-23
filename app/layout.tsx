import type { Metadata } from "next";
import { ReactNode } from "react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";

import { Providers } from "@/app/providers";
import "./globals.css";

export const metadata: Metadata = {
  title: { template: "%s | Aaron Curtis Yoga", default: "Aaron Curtis Yoga" },
  description: "Yoga Events & Education",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <Providers>
        <body>
          {children}
          <Analytics />
          <SpeedInsights />
        </body>
      </Providers>
    </html>
  );
}
