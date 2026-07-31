"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  PlayCircle,
  ShieldCheck,
  Clock,
  Zap,
  Lock,
  CheckCircle2,
  Video,
  AlertCircle,
  Loader2,
  RotateCcw,
} from "lucide-react";

// ──────────────────────────────────────────────
// Configuration
// ──────────────────────────────────────────────

const UNLOCK_DURATION_MS = 5 * 60 * 60 * 1000; // 5 hours
const AD_LOAD_TIMEOUT_MS = 15_000; // 15 seconds before fallback
const FALLBACK_COUNTDOWN_S = 5;

// ──────────────────────────────────────────────
// Google Publisher Tag (GPT) type declarations
// ──────────────────────────────────────────────

interface GptSlot {
  addService(service: unknown): GptSlot;
  getSlotElementId(): string;
}

interface RewardedSlotReadyEvent {
  makeRewardedVisible: () => void;
  slot: GptSlot;
}

interface RewardedSlotGrantedEvent {
  payload: { type: string; amount: number } | null;
  slot: GptSlot;
}

interface RewardedSlotClosedEvent {
  slot: GptSlot;
}

interface GptPubAds {
  addEventListener(
    eventType: "rewardedSlotReady",
    callback: (event: RewardedSlotReadyEvent) => void
  ): void;
  addEventListener(
    eventType: "rewardedSlotGranted",
    callback: (event: RewardedSlotGrantedEvent) => void
  ): void;
  addEventListener(
    eventType: "rewardedSlotClosed",
    callback: (event: RewardedSlotClosedEvent) => void
  ): void;
}

interface GoogleTag {
  apiReady?: boolean;
  cmd: Array<() => void>;
  defineOutOfPageSlot(
    adUnitPath: string,
    format: number
  ): GptSlot | null;
  pubads(): GptPubAds;
  enableServices(): void;
  display(slot: GptSlot): void;
  destroySlots(slots?: GptSlot[]): boolean;
  enums: {
    OutOfPageFormat: {
      REWARDED: number;
    };
  };
}

declare global {
  interface Window {
    googletag?: GoogleTag;
  }
}

// ──────────────────────────────────────────────
// GPT script loader (idempotent)
// ──────────────────────────────────────────────

function ensureGptLoaded(): Promise<void> {
  return new Promise((resolve, reject) => {
    // Bootstrap the command queue
    window.googletag = window.googletag || ({ cmd: [] } as unknown as GoogleTag);

    // Already fully ready
    if (window.googletag.apiReady) {
      resolve();
      return;
    }

    // Check if script tag already exists (e.g. from another component)
    const existing = document.querySelector(
      'script[src*="securepubads.g.doubleclick.net/tag/js/gpt.js"]'
    );

    const waitForReady = () => {
      const check = setInterval(() => {
        if (window.googletag?.apiReady) {
          clearInterval(check);
          resolve();
        }
      }, 50);
      setTimeout(() => {
        clearInterval(check);
        if (window.googletag?.apiReady) resolve();
        else reject(new Error("GPT timed out waiting for apiReady"));
      }, 10_000);
    };

    if (existing) {
      waitForReady();
      return;
    }

    // Inject the GPT script
    const script = document.createElement("script");
    script.src =
      "https://securepubads.g.doubleclick.net/tag/js/gpt.js";
    script.async = true;
    script.onload = () => waitForReady();
    script.onerror = () =>
      reject(new Error("Failed to load Google Publisher Tag script"));
    document.head.appendChild(script);
  });
}

// ──────────────────────────────────────────────
// Component
// ──────────────────────────────────────────────

/**
 * Phases of the ad lifecycle:
 *  idle       → button visible, nothing happening
 *  loading    → GPT script is being loaded
 *  requesting → GPT loaded, rewarded slot defined, waiting for ad fill
 *  showing    → Google's rewarded overlay is on screen
 *  fallback   → ad failed to load, using countdown fallback
 *  granted    → reward received, brief success state
 *  error      → ad closed without granting reward
 */
type AdPhase =
  | "idle"
  | "loading"
  | "requesting"
  | "showing"
  | "fallback"
  | "granted"
  | "error";

interface RewardedAdWallProps {
  children: React.ReactNode;
}

export function RewardedAdWall({ children }: RewardedAdWallProps) {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [adPhase, setAdPhase] = useState<AdPhase>("idle");
  const [fallbackCount, setFallbackCount] = useState(FALLBACK_COUNTDOWN_S);
  const [remainingFormatted, setRemainingFormatted] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // Refs to avoid stale closures inside GPT event callbacks
  const slotRef = useRef<GptSlot | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const grantedRef = useRef(false);
  const adPhaseRef = useRef<AdPhase>("idle");
  const servicesEnabledRef = useRef(false);
  const listenersAddedRef = useRef(false);

  // Keep adPhaseRef in sync
  useEffect(() => {
    adPhaseRef.current = adPhase;
  }, [adPhase]);

  // GAM configuration
  const networkCode = process.env.NEXT_PUBLIC_GAM_NETWORK_CODE ?? "";
  const adUnitPath = `/${networkCode}/rewarded_pdf_unlock`;

  // ── Unlock helpers ─────────────────────────

  const unlockSession = useCallback(() => {
    const until = Date.now() + UNLOCK_DURATION_MS;
    localStorage.setItem("pdf_unlock_until", until.toString());
    document.cookie = `pdf_unlocked=true; max-age=${5 * 60 * 60}; path=/`;
    setIsUnlocked(true);
    setAdPhase("idle");
  }, []);

  // Stable refs so GPT callbacks always call the latest version
  const unlockSessionRef = useRef(unlockSession);
  useEffect(() => {
    unlockSessionRef.current = unlockSession;
  }, [unlockSession]);

  const updateRemainingTime = useCallback((unlockTime: number) => {
    const diff = unlockTime - Date.now();
    if (diff <= 0) return;
    const h = Math.floor(diff / 3_600_000);
    const m = Math.floor((diff % 3_600_000) / 60_000);
    const s = Math.floor((diff % 60_000) / 1_000);
    setRemainingFormatted(`${h}h ${m}m ${s}s`);
  }, []);

  // ── Check existing unlock on mount ─────────

  useEffect(() => {
    const stored = localStorage.getItem("pdf_unlock_until");
    if (stored) {
      const until = parseInt(stored, 10);
      if (Date.now() < until) {
        setIsUnlocked(true);
        updateRemainingTime(until);
      } else {
        localStorage.removeItem("pdf_unlock_until");
      }
    }
    setIsChecking(false);

    // Live countdown of remaining time
    const interval = setInterval(() => {
      const s = localStorage.getItem("pdf_unlock_until");
      if (s) {
        const t = parseInt(s, 10);
        if (Date.now() < t) updateRemainingTime(t);
        else setIsUnlocked(false);
      }
    }, 1_000);

    return () => clearInterval(interval);
  }, [updateRemainingTime]);

  // ── Cleanup on unmount ─────────────────────

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (slotRef.current && window.googletag?.apiReady) {
        window.googletag.destroySlots([slotRef.current]);
      }
    };
  }, []);

  // ── Fallback countdown (ad blocker / no fill) ──

  const startFallback = useCallback(() => {
    setAdPhase("fallback");
    let count = FALLBACK_COUNTDOWN_S;
    setFallbackCount(count);

    const timer = setInterval(() => {
      count -= 1;
      setFallbackCount(count);
      if (count <= 0) {
        clearInterval(timer);
        unlockSessionRef.current();
      }
    }, 1_000);
  }, []);

  const startFallbackRef = useRef(startFallback);
  useEffect(() => {
    startFallbackRef.current = startFallback;
  }, [startFallback]);

  // ── Main ad request flow ───────────────────

  const handleWatchAd = useCallback(async () => {
    grantedRef.current = false;
    setErrorMsg("");

    // If GAM network code is not configured, go straight to fallback
    if (!networkCode) {
      console.warn(
        "[RewardedAdWall] NEXT_PUBLIC_GAM_NETWORK_CODE not set — using fallback"
      );
      startFallbackRef.current();
      return;
    }

    setAdPhase("loading");

    // Step 1: Load the GPT script
    try {
      await ensureGptLoaded();
    } catch (err) {
      console.warn("[RewardedAdWall] GPT failed to load:", err);
      startFallbackRef.current();
      return;
    }

    setAdPhase("requesting");

    // Step 2: Define slot & request ad (inside googletag command queue)
    window.googletag!.cmd.push(() => {
      const gt = window.googletag!;

      // Destroy any leftover slot from a previous attempt
      if (slotRef.current) {
        gt.destroySlots([slotRef.current]);
        slotRef.current = null;
      }

      // Define the rewarded out-of-page slot
      const slot = gt.defineOutOfPageSlot(
        adUnitPath,
        gt.enums.OutOfPageFormat.REWARDED
      );

      if (!slot) {
        // Browser doesn't support rewarded format (rare)
        console.warn(
          "[RewardedAdWall] Rewarded format not supported — using fallback"
        );
        startFallbackRef.current();
        return;
      }

      slotRef.current = slot;
      slot.addService(gt.pubads());

      // Register event listeners (only once, they persist across slots)
      if (!listenersAddedRef.current) {
        listenersAddedRef.current = true;

        // Ad is ready to be shown
        gt.pubads().addEventListener(
          "rewardedSlotReady",
          (evt: RewardedSlotReadyEvent) => {
            // Cancel the timeout since the ad loaded successfully
            if (timeoutRef.current) {
              clearTimeout(timeoutRef.current);
              timeoutRef.current = null;
            }
            setAdPhase("showing");
            // Show Google's rewarded ad overlay
            evt.makeRewardedVisible();
          }
        );

        // User completed the ad → grant reward
        gt.pubads().addEventListener(
          "rewardedSlotGranted",
          (_evt: RewardedSlotGrantedEvent) => {
            grantedRef.current = true;
            setAdPhase("granted");
            // Brief delay so user sees "Reward Granted!" before unlock
            setTimeout(() => unlockSessionRef.current(), 800);
          }
        );

        // Ad overlay was closed (may or may not have granted reward)
        gt.pubads().addEventListener(
          "rewardedSlotClosed",
          (_evt: RewardedSlotClosedEvent) => {
            // Clean up the slot for potential retry
            if (slotRef.current) {
              gt.destroySlots([slotRef.current]);
              slotRef.current = null;
            }

            // If reward was NOT granted, show error with retry option
            if (!grantedRef.current) {
              setAdPhase("error");
              setErrorMsg(
                "Ad was closed before completing. Please try again to unlock."
              );
            }
          }
        );
      }

      // Enable services (only once)
      if (!servicesEnabledRef.current) {
        gt.enableServices();
        servicesEnabledRef.current = true;
      }

      // Request the ad
      gt.display(slot);
    });

    // Step 3: Set a timeout — if the ad doesn't fill in time, use fallback
    timeoutRef.current = setTimeout(() => {
      const currentPhase = adPhaseRef.current;
      if (currentPhase === "requesting" || currentPhase === "loading") {
        console.warn("[RewardedAdWall] Ad request timed out — using fallback");
        // Clean up the pending slot
        if (slotRef.current && window.googletag?.apiReady) {
          window.googletag.destroySlots([slotRef.current]);
          slotRef.current = null;
        }
        startFallbackRef.current();
      }
    }, AD_LOAD_TIMEOUT_MS);
  }, [networkCode, adUnitPath]);

  // ──────────────────────────────────────────────
  // Render
  // ──────────────────────────────────────────────

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
            <span>
              Time Remaining:{" "}
              <strong className="text-foreground">
                {remainingFormatted || "5 hours"}
              </strong>
            </span>
          </div>
        </div>

        {children}
      </div>
    );
  }

  // ── Ad action area (varies by phase) ───────

  const renderAdAction = () => {
    switch (adPhase) {
      case "loading":
        return (
          <div className="w-full p-6 rounded-xl bg-primary/5 border border-primary/15 text-center space-y-2">
            <div className="flex items-center justify-center gap-2 text-primary font-semibold">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Loading ad system...</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Preparing your rewarded sponsor ad
            </p>
          </div>
        );

      case "requesting":
        return (
          <div className="w-full p-6 rounded-xl bg-primary/5 border border-primary/15 text-center space-y-2">
            <div className="flex items-center justify-center gap-2 text-primary font-semibold">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Requesting ad...</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Finding a sponsor ad for you. This may take a few seconds.
            </p>
          </div>
        );

      case "showing":
        return (
          <div className="w-full p-6 rounded-xl bg-amber-500/10 border border-amber-500/20 text-center space-y-2">
            <div className="flex items-center justify-center gap-2 text-amber-600 dark:text-amber-400 font-bold text-base">
              <Video className="h-5 w-5 animate-pulse" />
              <span>Ad Playing — Please Watch to Unlock</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Complete the ad to unlock all PDFs for 5 hours
            </p>
          </div>
        );

      case "fallback":
        return (
          <div className="w-full p-6 rounded-xl bg-primary/10 border border-primary/20 text-center space-y-3">
            <div className="flex items-center justify-center gap-2 text-primary font-bold text-base">
              <Video className="h-5 w-5 animate-pulse" />
              <span>Showing Rewarded Sponsor Ad...</span>
            </div>
            <div className="text-3xl font-extrabold text-foreground tracking-tight">
              {fallbackCount}s
            </div>
            <p className="text-xs text-muted-foreground">
              Unlocking all PDFs automatically when countdown finishes...
            </p>
          </div>
        );

      case "granted":
        return (
          <div className="w-full p-6 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center space-y-2">
            <div className="flex items-center justify-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-base">
              <CheckCircle2 className="h-5 w-5" />
              <span>Reward Granted!</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Unlocking all PDFs now...
            </p>
          </div>
        );

      case "error":
        return (
          <div className="w-full space-y-3">
            <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-center space-y-2">
              <div className="flex items-center justify-center gap-2 text-destructive font-semibold text-sm">
                <AlertCircle className="h-4 w-4" />
                <span>{errorMsg || "Something went wrong"}</span>
              </div>
            </div>
            <Button
              size="lg"
              variant="outline"
              className="w-full font-bold h-12 text-base group"
              onClick={handleWatchAd}
            >
              <RotateCcw className="mr-2 h-4 w-4 transition-transform group-hover:-rotate-90" />
              Try Again
            </Button>
          </div>
        );

      default: // idle
        return (
          <Button
            size="lg"
            className="w-full font-bold h-12 text-base shadow-lg shadow-primary/20 group"
            onClick={handleWatchAd}
          >
            <PlayCircle className="mr-2 h-5 w-5 transition-transform group-hover:scale-110" />
            Watch Short Ad to Unlock (5 Hours)
          </Button>
        );
    }
  };

  // ── Locked state card ──────────────────────

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
            Watch a short sponsor ad to unlock <strong>all PDFs</strong> on the
            website for the next <strong>5 hours</strong> uninterrupted!
          </CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col items-center space-y-5 pt-0">
          {/* Benefits Bullet List */}
          <div className="w-full bg-muted/50 rounded-xl p-4 border border-border/50 text-xs space-y-2.5">
            <div className="flex items-center gap-2 text-foreground font-medium">
              <CheckCircle2 className="h-4 w-4 text-emerald-500 flex-shrink-0" />
              <span>
                Full screen high-res PDF reading &amp; direct downloads
              </span>
            </div>
            <div className="flex items-center gap-2 text-foreground font-medium">
              <CheckCircle2 className="h-4 w-4 text-emerald-500 flex-shrink-0" />
              <span>
                Unlimited access to 10th, 1st &amp; 2nd PU &amp; KCET PDFs
              </span>
            </div>
            <div className="flex items-center gap-2 text-foreground font-medium">
              <Zap className="h-4 w-4 text-amber-500 flex-shrink-0" />
              <span>100% Free &amp; No registration required</span>
            </div>
          </div>

          {/* Ad Watch Action */}
          {renderAdAction()}

          <p className="text-[11px] text-muted-foreground text-center leading-relaxed">
            By watching ads, you keep study notes free &amp; accessible for
            thousands of Karnataka students. Thank you!
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
