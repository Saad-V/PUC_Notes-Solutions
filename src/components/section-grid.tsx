interface SectionGridProps {
  children: React.ReactNode;
  columns?: 2 | 3 | 4;
}

export function SectionGrid({ children, columns = 3 }: SectionGridProps) {
  const colsClass =
    columns === 2
      ? "grid-cols-1 sm:grid-cols-2"
      : columns === 4
        ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
        : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";

  return <div className={`grid ${colsClass} gap-4`}>{children}</div>;
}
