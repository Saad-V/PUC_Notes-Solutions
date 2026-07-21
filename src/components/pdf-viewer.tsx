"use client";

import { useEffect, useState } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Download, Share2, AlertTriangle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface PdfViewerProps {
  title: string;
  pdfUrl: string;
  fileId?: string;
  type?: "drive" | "local";
}

export function PdfViewer({ title, pdfUrl, fileId, type = "drive" }: PdfViewerProps) {
  // We'll use Google Drive's preview URL if it's a drive link
  const embedUrl = type === "drive" && fileId 
    ? `https://drive.google.com/file/d/${fileId}/preview` 
    : pdfUrl;

  return (
    <div className="flex flex-col space-y-4 w-full max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm">
            <Share2 className="mr-2 h-4 w-4" /> Share
          </Button>
          <Button variant="outline" size="sm">
            <AlertTriangle className="mr-2 h-4 w-4" /> Report Issue
          </Button>
          <a href={pdfUrl} target="_blank" rel="noopener noreferrer" className={buttonVariants({ size: "sm" })}>
            <Download className="mr-2 h-4 w-4" /> Download
          </a>
        </div>
      </div>

      <Card className="overflow-hidden border-2 shadow-sm h-[600px] md:h-[800px]">
        <CardContent className="p-0 h-full">
          <iframe
            src={embedUrl}
            className="w-full h-full border-0"
            allow="autoplay"
            title={title}
          />
        </CardContent>
      </Card>
    </div>
  );
}
