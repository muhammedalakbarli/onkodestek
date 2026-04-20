import { MetadataRoute } from "next";
import { db } from "@/lib/db";
import { patients } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

const BASE = process.env.NEXT_PUBLIC_APP_URL ?? "https://onkodestek.vercel.app";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE,               lastModified: new Date(), changeFrequency: "daily",   priority: 1 },
    { url: `${BASE}/patients`, lastModified: new Date(), changeFrequency: "hourly",  priority: 0.9 },
    { url: `${BASE}/transparency`, lastModified: new Date(), changeFrequency: "daily", priority: 0.8 },
    { url: `${BASE}/apply`,    lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/about`,    lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
  ];

  try {
    const publicPatients = await db
      .select({ id: patients.id, updatedAt: patients.updatedAt })
      .from(patients)
      .where(eq(patients.isPublic, true));

    const patientPages: MetadataRoute.Sitemap = publicPatients.map((p) => ({
      url:             `${BASE}/patients/${p.id}`,
      lastModified:    p.updatedAt,
      changeFrequency: "daily",
      priority:        0.8,
    }));

    return [...staticPages, ...patientPages];
  } catch {
    return staticPages;
  }
}
