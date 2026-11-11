import type { MetadataRoute } from "next";

import { config } from "@/lib/config";

export default function robots(): MetadataRoute.Robots {
  // Only production should be indexed; previews and local builds block everything.
  if (config.environment !== "production") {
    return { rules: { userAgent: "*", disallow: "/" } };
  }

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/api/",
    },
  };
}
