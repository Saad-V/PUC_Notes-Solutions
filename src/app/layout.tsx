import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { GoogleAutoAds } from "@/components/ads/google-auto-ads";
import { StickyBottomAd } from "@/components/ads/sticky-bottom-ad";
import { AnnouncementLightbox } from "@/components/announcement-lightbox";
import { SpeedInsights } from "@vercel/speed-insights/next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PUC Notes & Solutions",
  description: "Notes and textbooks of KSEEB 10th and DPUE 1st & 2nd PUC",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col pb-16 md:pb-20`}
      >
        <GoogleAutoAds />
        <Header />
        <AnnouncementLightbox />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
        <StickyBottomAd />
        <SpeedInsights />
      </body>
    </html>
  );
}

