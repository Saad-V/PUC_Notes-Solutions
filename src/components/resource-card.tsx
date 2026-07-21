import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { FileText, Download } from "lucide-react";
import type { ResourceData } from "@/lib/types";

interface ResourceCardProps {
  resource: ResourceData;
}

export function ResourceCard({ resource }: ResourceCardProps) {
  const drivePreviewUrl = resource.fileId
    ? `https://drive.google.com/file/d/${resource.fileId}/preview`
    : resource.pdfUrl;

  return (
    <Card className="hover:border-primary/50 transition-colors">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className="rounded-md bg-primary/10 p-2 shrink-0">
            <FileText className="h-4 w-4 text-primary" />
          </div>
          <div className="min-w-0">
            <CardTitle className="text-sm font-medium truncate">
              {resource.linkText || resource.chapterName || 'Document'}
            </CardTitle>
            {resource.resourceType && resource.resourceType !== 'unknown' && (
              <CardDescription className="text-xs capitalize">
                {resource.resourceType.replace(/_/g, ' ')}
              </CardDescription>
            )}
          </div>
        </div>
        <a
          href={resource.pdfUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={buttonVariants({ variant: "outline", size: "sm" })}
        >
          <Download className="h-3 w-3 mr-1" />
          PDF
        </a>
      </CardHeader>
    </Card>
  );
}
