import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";

const ALLOWED = ["application/pdf", "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
const MAX_BYTES = 5 * 1024 * 1024; // 5 MB

export async function POST(req: NextRequest) {
  const form = await req.formData();
  const file = form.get("cv") as File | null;

  if (!file) return NextResponse.json({ error: "Fayl tapılmadı" }, { status: 400 });
  if (!ALLOWED.includes(file.type)) {
    return NextResponse.json({ error: "Yalnız PDF, DOC və ya DOCX faylları qəbul edilir" }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "Fayl ölçüsü 5 MB-dan çox ola bilməz" }, { status: 400 });
  }

  const ext  = file.name.split(".").pop() ?? "pdf";
  const name = `volunteers/cv-${Date.now()}.${ext}`;
  const blob = await put(name, file, { access: "public" });

  return NextResponse.json({ url: blob.url });
}
