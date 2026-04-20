import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Yardım müraciəti",
  description: "Onkoloji xəstə üçün yardım müraciəti göndərin. Müraciətiniz komandamız tərəfindən yoxlanılacaq.",
};

export default function ApplyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
