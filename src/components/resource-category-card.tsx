import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ChevronRight } from "lucide-react";
import { getIcon } from "@/components/icon-map";
import type { ResourceCategory } from "@/lib/types";

interface ResourceCategoryCardProps {
  category: ResourceCategory;
  /** The parent subject slug for link construction */
  parentSlug: string;
}

export function ResourceCategoryCard({ category, parentSlug }: ResourceCategoryCardProps) {
  const Icon = getIcon(category.icon);

  return (
    <Link href={`/${parentSlug}/${category.slug}`} className="group block">
      <Card className="h-full hover:border-primary/50 hover:shadow-md transition-all duration-200 cursor-pointer">
        <CardHeader className="flex flex-row items-center gap-4 py-6">
          <div className="rounded-lg bg-primary/10 p-3 shrink-0 group-hover:bg-primary/20 transition-colors">
            <Icon className="h-6 w-6 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <CardTitle className="text-base font-semibold group-hover:text-primary transition-colors">
                {category.title}
              </CardTitle>
              <span className="inline-flex items-center rounded-md bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground shrink-0">
                {category.count} {category.count === 1 ? 'PDF' : 'PDFs'}
              </span>
            </div>
            <CardDescription className="text-sm line-clamp-1">
              {category.description}
            </CardDescription>
          </div>
          <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
        </CardHeader>
      </Card>
    </Link>
  );
}
