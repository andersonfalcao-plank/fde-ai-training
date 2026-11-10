import { env } from "@/lib/env";

// App-facing values derived from env, with fallbacks for local development.
export const config = {
  environment: env.VERCEL_ENV,
  commit: env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) ?? "local",
} as const;
