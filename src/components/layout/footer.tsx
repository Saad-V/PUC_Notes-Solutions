import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t bg-muted/40 py-6 md:py-0">
      <div className="container mx-auto px-4 flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
        <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
          Built for students. Educational purposes only.
        </p>
        <div className="flex items-center space-x-4 text-sm font-medium">
          <Link
            href="/about"
            className="text-muted-foreground hover:text-foreground"
          >
            About
          </Link>
          <Link
            href="/contact"
            className="text-muted-foreground hover:text-foreground"
          >
            Contact
          </Link>
          <Link
            href="/privacy-policy"
            className="text-muted-foreground hover:text-foreground"
          >
            Privacy Policy
          </Link>
          <Link
            href="/terms-conditions"
            className="text-muted-foreground hover:text-foreground"
          >
            Terms & Conditions
          </Link>
        </div>
      </div>
    </footer>
  );
}
