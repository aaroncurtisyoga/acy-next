import { ReactNode } from "react";
import Script from "next/script";
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
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "AC Yoga",
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${robotoFlex.variable} ${merriweather.variable} font-sans bg-background text-foreground antialiased`}
        suppressHydrationWarning
      >
        <Providers>
          {children}
          <Analytics />
        </Providers>
        <Script id="sw-register" strategy="afterInteractive">
          {`if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js');
          }`}
        </Script>
      </body>
    </html>
  );
}
