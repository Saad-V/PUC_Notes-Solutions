import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface StreamCardProps {
  name: string;
  slug: string;
  subjectCount: number;
}

export function StreamCard({ name, slug, subjectCount }: StreamCardProps) {
  return (
    <Link href={`/${slug}`} className="group">
      <Card className="h-full hover:border-primary transition-colors cursor-pointer">
        <CardHeader className="text-center py-8">
          <CardTitle className="text-xl group-hover:text-primary transition-colors">
            {name}
          </CardTitle>
          <CardDescription>
            {subjectCount} subject{subjectCount !== 1 ? 's' : ''}
          </CardDescription>
        </CardHeader>
      </Card>
    </Link>
  );
}
