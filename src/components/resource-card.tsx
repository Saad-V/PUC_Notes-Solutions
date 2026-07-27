import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { FileText, Download } from "lucide-react";
import type { ResourceData } from "@/lib/types";

interface ResourceCardProps {
  resource: ResourceData;
}

export function ResourceCard({ resource }: ResourceCardProps) {
  const displayTitle = resource.linkText || 'Document';
  const hasChapterName = resource.chapterName && resource.chapterName.trim().length > 0;

  return (
    <a
      href={resource.pdfUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="block group no-underline text-foreground"
    >
      <Card className="hover:border-primary/60 hover:shadow-md transition-all duration-200 cursor-pointer group-hover:bg-accent/40">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4">
          <div className="flex items-center gap-3.5 min-w-0 flex-1">
            <div className="rounded-lg bg-primary/10 p-2.5 shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
              <FileText className="h-4 w-4 text-primary group-hover:text-primary-foreground transition-colors" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <CardTitle className="text-sm font-semibold truncate group-hover:text-primary transition-colors">
                  {displayTitle}
                </CardTitle>
                {hasChapterName && (
                  <span className="text-xs text-muted-foreground truncate font-normal">
                    — {resource.chapterName}
                  </span>
                )}
              </div>
              
              <div className="flex items-center gap-2 mt-0.5">
                {resource.resourceType && resource.resourceType !== 'unknown' && (
                  <CardDescription className="text-xs capitalize">
                    {resource.resourceType.replace(/_/g, ' ')}
                  </CardDescription>
                )}
                {resource.notes && (
                  <span className="text-xs text-muted-foreground truncate">
                    • {resource.notes}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 ml-3">
            <span
              className={buttonVariants({
                variant: "outline",
                size: "sm",
                className: "group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-all",
              })}
            >
              <Download className="h-3.5 w-3.5 mr-1" />
              PDF
            </span>
          </div>
        </CardHeader>
      </Card>
    </a>
  );
}

