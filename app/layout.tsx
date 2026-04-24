import type { Metadata } from "next";
import { Inter } from "next/font/google";
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
    default: "onkodəstək — Həyata dəstək ol",
    template: "%s | onkodəstək",
  },
  description:
    "Azərbaycanda onkoloji xəstəliklərlə mübarizə aparan şəxslərə şəffaf xeyriyyəçilik platforması. Hər ianənin hara xərcləndiyini real vaxt rejimində izləyin.",
  keywords: ["xeyriyyə", "onkologiya", "xərçəng", "Azərbaycan", "şəffaflıq", "ianə", "onkodestek"],
  authors: [{ name: "onkodəstək" }],
  creator: "onkodəstək",
  openGraph: {
    title: "onkodəstək — Həyata dəstək ol",
    description: "Azərbaycanda onkoloji xəstəliklərə qarşı şəffaf xeyriyyəçilik platforması.",
    url: APP_URL,
    siteName: "onkodəstək",
    locale: "az_AZ",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "onkodəstək — Həyata dəstək ol",
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
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="az">
      <body className={`${inter.variable} font-sans bg-slate-50 text-slate-900 antialiased min-h-full flex flex-col`}>
        {children}
      </body>
    </html>
  );
}
