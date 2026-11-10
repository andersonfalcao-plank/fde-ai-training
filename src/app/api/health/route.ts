import { connection } from "next/server";

import { config } from "@/lib/config";

export async function GET() {
  // Run on every request instead of prerendering at build time.
  await connection();

  return Response.json({ status: "ok", commit: config.commit });
}
