"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PlayCircle, ShieldCheck, Clock, Zap, Lock, CheckCircle2, Video } from "lucide-react";

interface RewardedAdWallProps {
  children: React.ReactNode;
}

const UNLOCK_DURATION_MS = 5 * 60 * 60 * 1000; // 5 hours

declare global {
  interface Window {
    adsbygoogle?: Record<string, unknown>[];
    google_ad_client?: string;
  }
}

export function RewardedAdWall({ children }: RewardedAdWallProps) {
  const [isUnlocked, setIsUnlocked] = useState<boolean>(false);
  const [isChecking, setIsChecking] = useState<boolean>(true);
  const [isWatchingAd, setIsWatchingAd] = useState<boolean>(false);
  const [countdownSeconds, setCountdownSeconds] = useState<number>(5);
  const [remainingFormatted, setRemainingFormatted] = useState<string>("");

  const updateRemainingTime = (unlockTime: number) => {
    const diffMs = unlockTime - Date.now();
    if (diffMs <= 0) return;
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const mins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    const secs = Math.floor((diffMs % (1000 * 60)) / 1000);
    setRemainingFormatted(`${hours}h ${mins}m ${secs}s`);
  };

  useEffect(() => {
    const checkUnlockStatus = () => {
      const unlockUntil = localStorage.getItem("pdf_unlock_until");
      if (unlockUntil) {
        const unlockTime = parseInt(unlockUntil, 10);
        const now = Date.now();
        if (now < unlockTime) {
          setIsUnlocked(true);
          updateRemainingTime(unlockTime);
        } else {
          setIsUnlocked(false);
          localStorage.removeItem("pdf_unlock_until");
        }
      } else {
        setIsUnlocked(false);
      }
      setIsChecking(false);
    };

    checkUnlockStatus();

    // Timer interval to keep remaining time updated
    const interval = setInterval(() => {
      const unlockUntil = localStorage.getItem("pdf_unlock_until");
      if (unlockUntil) {
        const unlockTime = parseInt(unlockUntil, 10);
        if (Date.now() < unlockTime) {
          updateRemainingTime(unlockTime);
        } else {
          setIsUnlocked(false);
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleWatchAd = () => {
    setIsWatchingAd(true);
    setCountdownSeconds(5);

    // Try Google Rewarded Ads API if initialized on page
    if (typeof window !== "undefined" && window.google_ad_client) {
      try {
        const rawClientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || "";
        const adClientId = rawClientId && !rawClientId.startsWith("ca-") ? `ca-${rawClientId}` : rawClientId;

        // eslint-disable-next-line react-hooks/immutability
        window.adsbygoogle = window.adsbygoogle || [];
        window.adsbygoogle.push({
          google_ad_client: adClientId,
          enable_page_level_ads: { rewarded: true },
        });
      } catch (e) {
        console.log("Fallback to interactive ad simulation:", e);
      }
    }

    // Interactive countdown video timer simulation
    const timer = setInterval(() => {
      setCountdownSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          unlockSession();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const unlockSession = () => {
    const unlockTime = Date.now() + UNLOCK_DURATION_MS;
    localStorage.setItem("pdf_unlock_until", unlockTime.toString());
    // Also set cookie for optional server verification
    document.cookie = `pdf_unlocked=true; max-age=${5 * 60 * 60}; path=/`;
    setIsUnlocked(true);
    setIsWatchingAd(false);
  };

  if (isChecking) {
    return (
      <div className="flex items-center justify-center p-12 text-muted-foreground gap-2">
        <Clock className="h-4 w-4 animate-spin text-primary" />
        Checking access permissions...
      </div>
    );
  }

  if (isUnlocked) {
    return (
      <div className="space-y-4">
        {/* Active Access Banner */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl bg-gradient-to-r from-emerald-500/10 via-primary/10 to-transparent border border-emerald-500/20 text-xs">
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-semibold">
            <ShieldCheck className="h-4 w-4 flex-shrink-0" />
            <span>5-Hour Unlimited Pass Active</span>
          </div>

          <div className="flex items-center gap-2 text-muted-foreground font-medium">
            <Clock className="h-3.5 w-3.5 text-primary" />
            <span>Time Remaining: <strong className="text-foreground">{remainingFormatted || "5 hours"}</strong></span>
          </div>
        </div>

        {children}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-8 px-4">
      <Card className="max-w-md w-full relative overflow-hidden border-2 border-primary/20 shadow-2xl backdrop-blur-xl bg-card/95">
        {/* Top Glow Accent */}
        <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-primary via-indigo-500 to-purple-600" />

        <CardHeader className="text-center pb-4">
          <div className="mx-auto mb-3 p-3 rounded-full bg-primary/10 text-primary w-fit ring-8 ring-primary/5">
            <Lock className="h-8 w-8" />
          </div>
          <CardTitle className="text-2xl font-extrabold tracking-tight">
            Unlock Full PDF Access
          </CardTitle>
          <CardDescription className="text-sm mt-1">
            Watch a short 5-second sponsor ad to unlock **all PDFs** on the website for the next **5 hours** uninterrupted!
          </CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col items-center space-y-5 pt-0">
          {/* Benefits Bullet List */}
          <div className="w-full bg-muted/50 rounded-xl p-4 border border-border/50 text-xs space-y-2.5">
            <div className="flex items-center gap-2 text-foreground font-medium">
              <CheckCircle2 className="h-4 w-4 text-emerald-500 flex-shrink-0" />
              <span>Full screen high-res PDF reading & direct downloads</span>
            </div>
            <div className="flex items-center gap-2 text-foreground font-medium">
              <CheckCircle2 className="h-4 w-4 text-emerald-500 flex-shrink-0" />
              <span>Unlimited access to 10th, 1st & 2nd PU & KCET PDFs</span>
            </div>
            <div className="flex items-center gap-2 text-foreground font-medium">
              <Zap className="h-4 w-4 text-amber-500 flex-shrink-0" />
              <span>100% Free & No registration required</span>
            </div>
          </div>

          {/* Ad Watch Action */}
          {isWatchingAd ? (
            <div className="w-full p-6 rounded-xl bg-primary/10 border border-primary/20 text-center space-y-3">
              <div className="flex items-center justify-center gap-2 text-primary font-bold text-base">
                <Video className="h-5 w-5 animate-pulse" />
                <span>Showing Rewarded Sponsor Ad...</span>
              </div>
              <div className="text-3xl font-extrabold text-foreground tracking-tight">
                {countdownSeconds}s
              </div>
              <p className="text-xs text-muted-foreground">
                Unlocking all PDFs automatically when countdown finishes...
              </p>
            </div>
          ) : (
            <Button
              size="lg"
              className="w-full font-bold h-12 text-base shadow-lg shadow-primary/20 group"
              onClick={handleWatchAd}
            >
              <PlayCircle className="mr-2 h-5 w-5 transition-transform group-hover:scale-110" />
              Watch Short Ad to Unlock (5 Hours)
            </Button>
          )}

          <p className="text-[11px] text-muted-foreground text-center leading-relaxed">
            By watching ads, you keep study notes free & accessible for thousands of Karnataka students. Thank you!
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
