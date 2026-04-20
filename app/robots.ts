import { MetadataRoute } from "next";

const BASE = process.env.NEXT_PUBLIC_APP_URL ?? "https://onkodestek.vercel.app";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/patients", "/transparency", "/apply", "/track", "/about"],
        disallow: ["/dashboard/", "/api/", "/me"],
      },
    ],
    sitemap: `${BASE}/sitemap.xml`,
  };
}
