"use client";

import { useEffect, useRef } from "react";

interface AdBannerProps {
  slot?: string;
  format?: "auto" | "fluid" | "rectangle" | "horizontal" | "vertical";
  responsive?: boolean;
  className?: string;
}

declare global {
  interface Window {
    adsbygoogle?: Record<string, unknown>[];
  }
}

export function AdBanner({
  slot = "1234567890",
  format = "auto",
  responsive = true,
  className = "",
}: AdBannerProps) {
  const adRef = useRef<HTMLDivElement>(null);
  const rawClient = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || "ca-pub-XXXXXXXXXXXXXX";
  const client = rawClient.startsWith("ca-") ? rawClient : `ca-${rawClient}`;
  const showTestAds = process.env.NEXT_PUBLIC_ENABLE_TEST_ADS === "true";
  const isDev = !showTestAds && (process.env.NODE_ENV === "development" || client === "ca-pub-XXXXXXXXXXXXXX");

  useEffect(() => {
    if (!isDev && client !== "ca-pub-XXXXXXXXXXXXXX") {
      try {
        const insElement = adRef.current?.querySelector("ins.adsbygoogle");
        if (insElement && !insElement.getAttribute("data-adsbygoogle-status")) {
          window.adsbygoogle = window.adsbygoogle || [];
          window.adsbygoogle.push({});
        }
      } catch (err) {
        console.error("AdSense error:", err);
      }
    }
  }, [isDev, client]);

  if (isDev) {
    return (
      <div
        className={`my-6 border border-dashed border-primary/30 rounded-xl p-4 bg-muted/30 text-center flex flex-col items-center justify-center min-h-[100px] text-xs text-muted-foreground ${className}`}
      >
        <span className="font-semibold text-primary/80 mb-1">📢 Advertisement Unit (AdSense Demo)</span>
        <span>Format: {format} | Slot: {slot}</span>
        <span className="text-[10px] opacity-75 mt-1">Configured for Google AdSense Production Deployment</span>
      </div>
    );
  }

  return (
    <div className={`my-6 overflow-hidden text-center min-h-[90px] bg-muted/20 rounded-lg border border-border/40 flex items-center justify-center ${className}`} ref={adRef}>
      <ins
        className="adsbygoogle"
        style={{ display: "block", minWidth: "250px", minHeight: "90px" }}
        data-ad-client={client}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive ? "true" : "false"}
        {...(showTestAds ? { "data-ad-test": "on" } : {})}
      />
    </div>
  );
}
