import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center gap-6 px-4 py-16">
      <h1 className="text-4xl font-semibold tracking-tight">WorkBot</h1>
      <p className="text-lg leading-relaxed text-muted-foreground">
        WorkBot is an assistant for everyday work. It takes the repetitive parts
        of a task off your plate, so you can spend your time on the decisions
        that need you.
      </p>
      <div className="flex flex-wrap gap-3">
        <Link href="/settings" className={buttonVariants({ size: "lg" })}>
          Settings
        </Link>
        {/* An API route, not a page: a plain anchor skips client navigation. */}
        <a
          href="/api/health"
          className={buttonVariants({ variant: "outline", size: "lg" })}
        >
          Health check
        </a>
      </div>
    </main>
  );
}
