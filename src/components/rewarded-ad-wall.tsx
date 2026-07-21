"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PlayCircle } from "lucide-react";

interface RewardedAdWallProps {
  children: React.ReactNode;
}

const UNLOCK_DURATION_MS = 5 * 60 * 60 * 1000; // 5 hours

export function RewardedAdWall({ children }: RewardedAdWallProps) {
  const [isUnlocked, setIsUnlocked] = useState<boolean>(true);
  const [isChecking, setIsChecking] = useState<boolean>(true);
  const [isWatchingAd, setIsWatchingAd] = useState<boolean>(false);

  useEffect(() => {
    // Check local storage for unlock status on mount
    const checkUnlockStatus = () => {
      const unlockUntil = localStorage.getItem("pdf_unlock_until");
      if (unlockUntil) {
        const unlockTime = parseInt(unlockUntil, 10);
        if (Date.now() < unlockTime) {
          setIsUnlocked(true);
        } else {
          setIsUnlocked(false);
        }
      } else {
        setIsUnlocked(false);
      }
      setIsChecking(false);
    };

    checkUnlockStatus();
  }, []);

  const handleWatchAd = () => {
    setIsWatchingAd(true);
    // Simulate watching an ad
    setTimeout(() => {
      const unlockTime = Date.now() + UNLOCK_DURATION_MS;
      localStorage.setItem("pdf_unlock_until", unlockTime.toString());
      setIsUnlocked(true);
      setIsWatchingAd(false);
    }, 2000);
  };

  if (isChecking) {
    return <div className="flex justify-center p-12">Loading...</div>;
  }

  if (isUnlocked) {
    return <>{children}</>;
  }

  return (
    <div className="flex items-center justify-center py-12">
      <Card className="max-w-md w-full text-center">
        <CardHeader>
          <CardTitle className="text-2xl">Unlock This PDF</CardTitle>
          <CardDescription>
            Watch a short advertisement to unlock all PDFs on the site for the next 5 hours.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-4">
          <div className="rounded-full bg-primary/10 p-4">
            <PlayCircle className="h-12 w-12 text-primary" />
          </div>
          <Button 
            size="lg" 
            className="w-full font-bold" 
            onClick={handleWatchAd}
            disabled={isWatchingAd}
          >
            {isWatchingAd ? "Watching Ad..." : "Watch Ad to Unlock"}
          </Button>
          <p className="text-xs text-muted-foreground mt-4">
            By supporting us with ads, you help keep PUC Notes free for everyone.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
