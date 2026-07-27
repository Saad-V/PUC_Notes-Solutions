"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { AdBanner } from "@/components/ads/ad-banner";

export function StickyBottomAd() {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-background/95 backdrop-blur border-t border-border shadow-2xl p-2 md:p-3 transition-all duration-300">
      <div className="max-w-5xl mx-auto flex items-center justify-between gap-2">
        <div className="flex-1 overflow-hidden">
          <AdBanner slot="9988776655" format="horizontal" responsive={true} className="my-0" />
        </div>
        <button
          onClick={() => setDismissed(true)}
          className="p-1.5 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors flex-shrink-0"
          aria-label="Close Advertisement"
          title="Close Ad"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
