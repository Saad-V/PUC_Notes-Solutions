import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface ClassCardProps {
  name: string;
  slug: string;
  board: string;
  streamCount: number;
}

export function ClassCard({ name, slug, board, streamCount }: ClassCardProps) {
  return (
    <Link href={`/${slug}`} className="group">
      <Card className="h-full hover:border-primary transition-colors cursor-pointer">
        <CardHeader className="text-center py-8">
          <CardTitle className="text-2xl group-hover:text-primary transition-colors">
            {name}
          </CardTitle>
          <CardDescription>
            {board} {streamCount > 0 ? `· ${streamCount} streams` : ''}
          </CardDescription>
        </CardHeader>
      </Card>
    </Link>
  );
}
