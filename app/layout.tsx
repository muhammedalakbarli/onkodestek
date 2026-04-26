import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getUserBanStatus } from "@/lib/checkBan";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://onkodestek.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: "OnkoDəstək — Həyata dəstək ol",
    template: "%s | OnkoDəstək",
  },
  description:
    "Azərbaycanda onkoloji xəstəliklərlə mübarizə aparan şəxslərə şəffaf xeyriyyəçilik platforması. Hər ianənin hara xərcləndiyini real vaxt rejimində izləyin.",
  keywords: ["xeyriyyə", "onkologiya", "xərçəng", "Azərbaycan", "şəffaflıq", "ianə", "onkodestek"],
  authors: [{ name: "OnkoDəstək" }],
  creator: "OnkoDəstək",
  openGraph: {
    title: "OnkoDəstək — Həyata dəstək ol",
    description: "Azərbaycanda onkoloji xəstəliklərə qarşı şəffaf xeyriyyəçilik platforması.",
    url: APP_URL,
    siteName: "OnkoDəstək",
    locale: "az_AZ",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "OnkoDəstək — Həyata dəstək ol",
    description: "Azərbaycanda onkoloji xəstəliklərə qarşı şəffaf xeyriyyəçilik platforması.",
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/logo.jpeg",
    apple: "/logo.jpeg",
  },
  manifest: "/manifest.json",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Ban yoxlaması — /banned, /login, /api, /dashboard üçün skip
  const hdrs = await headers();
  const pathname = hdrs.get("x-pathname") ?? "";
  const skipBanCheck =
    pathname === "/banned" ||
    pathname === "/login" ||
    pathname.startsWith("/api/") ||
    pathname.startsWith("/dashboard");

  if (!skipBanCheck) {
    const session = await auth();
    if (session?.user?.id) {
      const { isBanned } = await getUserBanStatus(session.user.id);
      if (isBanned) redirect("/banned");
    }
  }

  return (
    <html lang="az">
      <body className={`${inter.variable} font-sans bg-slate-50 text-slate-900 antialiased min-h-full flex flex-col`}>
        {children}
      </body>
    </html>
  );
}
