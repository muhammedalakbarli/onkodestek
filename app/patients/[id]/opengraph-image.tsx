import { ImageResponse } from "next/og";
import { db } from "@/lib/db";
import { patients } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { calcProgress } from "@/lib/utils";

export const runtime = "nodejs";
export const revalidate = 3600;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

function formatAZN(val: string | number) {
  return Number(val).toLocaleString("az-AZ", { style: "currency", currency: "AZN", maximumFractionDigits: 0 });
}

export default async function OgImage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let name = "OnkoDəstək";
  let diagnosis = "Azərbaycanda xərçənglə mübarizə";
  let collected = 0;
  let goal = 1;
  let pct = 0;

  try {
    const [p] = await db.select().from(patients).where(eq(patients.id, parseInt(id)));
    if (p) {
      name = p.fullName;
      diagnosis = p.diagnosis;
      collected = Number(p.collectedAmount);
      goal = Number(p.goalAmount);
      pct = calcProgress(p.collectedAmount, p.goalAmount);
    }
  } catch { /* keep defaults */ }

  const barWidth = Math.min(pct, 100);

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "100%",
          background: "linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 50%, #f0f9ff 100%)",
          padding: "64px",
          fontFamily: "system-ui, sans-serif",
          position: "relative",
        }}
      >
        {/* Branding */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "40px" }}>
          <div style={{
            width: "48px", height: "48px",
            background: "#0d9488",
            borderRadius: "12px",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <span style={{ color: "white", fontSize: "24px", fontWeight: "900" }}>O</span>
          </div>
          <span style={{ fontSize: "22px", fontWeight: "700", color: "#0f766e" }}>OnkoDəstək</span>
        </div>

        {/* Patient name */}
        <div style={{
          fontSize: "52px",
          fontWeight: "900",
          color: "#0f172a",
          lineHeight: 1.1,
          marginBottom: "16px",
          maxWidth: "900px",
        }}>
          {name}
        </div>

        {/* Diagnosis */}
        <div style={{
          fontSize: "26px",
          color: "#475569",
          marginBottom: "48px",
          maxWidth: "800px",
          overflow: "hidden",
        }}>
          {diagnosis}
        </div>

        {/* Progress bar */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
            <span style={{ fontSize: "32px", fontWeight: "800", color: "#059669" }}>
              {formatAZN(collected)}
            </span>
            <span style={{ fontSize: "22px", color: "#64748b" }}>
              hədəf: {formatAZN(goal)}
            </span>
          </div>
          <div style={{
            width: "100%", height: "18px",
            background: "#e2e8f0",
            borderRadius: "9px",
            overflow: "hidden",
          }}>
            <div style={{
              width: `${barWidth}%`,
              height: "100%",
              background: "linear-gradient(90deg, #10b981, #059669)",
              borderRadius: "9px",
            }} />
          </div>
          <div style={{ fontSize: "20px", color: "#64748b" }}>
            {pct}% tamamlandı
          </div>
        </div>

        {/* CTA */}
        <div style={{
          position: "absolute",
          bottom: "64px",
          right: "64px",
          background: "#0d9488",
          color: "white",
          fontSize: "20px",
          fontWeight: "700",
          padding: "14px 32px",
          borderRadius: "12px",
        }}>
          Dəstək ol →
        </div>
      </div>
    ),
    { ...size },
  );
}
