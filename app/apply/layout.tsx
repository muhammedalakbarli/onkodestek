import Navbar from "@/components/Navbar";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Yardım müraciəti",
  description: "OnkoDəstək platformasına yardım müraciəti göndərin. Tibbi sənədlərinizi yükləyin, komandamız 1-3 iş günü ərzində sizinlə əlaqə saxlayacaq.",
};

export default function ApplyLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}
