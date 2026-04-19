import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "onkodəstək — Həyata dəstək ol",
  description:
    "Azərbaycanda onkoloji xəstəliklərlə mübarizə aparan şəxslərə şəffaf xeyriyyəçilik platforması. Hər ianənin hara xərcləndiyini real vaxt rejimində izləyin.",
  keywords: ["xeyriyyə", "onkologiya", "xərçəng", "Azerbaijan", "şəffaflıq"],
  openGraph: {
    title: "onkodəstək",
    description: "Həyata dəstək ol — Şəffaf onkoloji yardım platforması",
    locale: "az_AZ",
    type: "website",
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
