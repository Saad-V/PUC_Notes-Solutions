"use client";

import { useState } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Download, Share2, AlertTriangle, Check } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { RewardedAdWall } from "@/components/rewarded-ad-wall";
import { AdBanner } from "@/components/ads/ad-banner";

interface PdfViewerProps {
  title: string;
  pdfUrl: string;
  fileId?: string;
  type?: "drive" | "local";
}

export function PdfViewer({ title, pdfUrl, fileId, type = "drive" }: PdfViewerProps) {
  const [copied, setCopied] = useState(false);

  const embedUrl = type === "drive" && fileId 
    ? `https://drive.google.com/file/d/${fileId}/preview` 
    : pdfUrl;

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <RewardedAdWall>
      <div className="flex flex-col space-y-4 w-full max-w-5xl mx-auto py-2">
        {/* Top Ad Unit */}
        <AdBanner slot="1122334455" format="horizontal" className="my-2" />

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="text-xl md:text-2xl font-bold tracking-tight">{title}</h2>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={handleShare}>
              {copied ? <Check className="mr-2 h-4 w-4 text-emerald-500" /> : <Share2 className="mr-2 h-4 w-4" />}
              {copied ? "Copied Link!" : "Share"}
            </Button>
            <Button variant="outline" size="sm" onClick={() => alert("Issue report submitted! Thank you.")}>
              <AlertTriangle className="mr-2 h-4 w-4" /> Report Issue
            </Button>
            <a href={pdfUrl} target="_blank" rel="noopener noreferrer" className={buttonVariants({ size: "sm" })}>
              <Download className="mr-2 h-4 w-4" /> Download PDF
            </a>
          </div>
        </div>

        <Card className="overflow-hidden border-2 shadow-sm h-[600px] md:h-[800px] bg-background">
          <CardContent className="p-0 h-full">
            <iframe
              src={embedUrl}
              className="w-full h-full border-0"
              allow="autoplay"
              title={title}
            />
          </CardContent>
        </Card>

        {/* Bottom Ad Unit */}
        <AdBanner slot="5544332211" format="horizontal" className="my-4" />
      </div>
    </RewardedAdWall>
  );
}

