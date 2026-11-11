import type { Metadata } from "next";
import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Page not found",
};

export default function NotFound() {
  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center gap-4 px-4 py-16 text-center">
      <h1 className="text-6xl font-semibold tracking-tight">404</h1>
      <p className="text-lg text-muted-foreground">
        We couldn&apos;t find the page you were looking for. Head back home to
        keep going.
      </p>
      <Link href="/" className={cn(buttonVariants({ size: "lg" }))}>
        Back to home
      </Link>
    </main>
  );
}
