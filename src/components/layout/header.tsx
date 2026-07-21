import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center mx-auto px-4">
        <div className="mr-4 flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="hidden font-bold sm:inline-block text-xl">
              PUC Notes
            </span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link
              href="/10thkseebresources"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              10th
            </Link>
            <Link
              href="/1stpuckarnataka"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              1st PU
            </Link>
            <Link
              href="/2ndpuckarnataka"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              2nd PU
            </Link>
            <Link
              href="/kcet"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              KCET
            </Link>
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-2">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            {/* Search placeholder */}
          </div>
          <nav className="flex items-center">
            <Link href="/about" className={buttonVariants({ variant: "outline" })}>
              About Us
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
