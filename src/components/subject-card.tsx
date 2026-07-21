import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface SubjectCardProps {
  name: string;
  slug: string;
  resourceCount?: number;
  description?: string;
}

export function SubjectCard({ name, slug, resourceCount, description }: SubjectCardProps) {
  return (
    <Link href={`/${slug}`} className="group">
      <Card className="h-full hover:border-primary transition-colors cursor-pointer">
        <CardHeader className="py-6">
          <CardTitle className="text-lg group-hover:text-primary transition-colors">
            {name}
          </CardTitle>
          {description && (
            <CardDescription className="line-clamp-2">{description}</CardDescription>
          )}
          {resourceCount !== undefined && resourceCount > 0 && (
            <CardDescription>
              {resourceCount} resource{resourceCount !== 1 ? 's' : ''}
            </CardDescription>
          )}
        </CardHeader>
      </Card>
    </Link>
  );
}
