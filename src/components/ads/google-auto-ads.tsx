"use client";

import { useEffect } from "react";

interface GoogleAutoAdsProps {
  client?: string;
}

export function GoogleAutoAds({ client }: GoogleAutoAdsProps) {
  const rawId = client || process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || "ca-pub-XXXXXXXXXXXXXX";
  const adClientId = rawId.startsWith("ca-") ? rawId : `ca-${rawId}`;

  useEffect(() => {
    // Skip injection if placeholder value in development or unconfigured
    if (!adClientId || adClientId === "ca-pub-XXXXXXXXXXXXXX") {
      return;
    }

    // Prevent duplicate script tag insertion
    const existingScript = document.querySelector(`script[src*="adsbygoogle.js"]`);
    if (existingScript) return;

    const script = document.createElement("script");
    script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adClientId}`;
    script.async = true;
    script.crossOrigin = "anonymous";

    document.head.appendChild(script);
  }, [adClientId]);

  return null;
}

