import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "../drizzle/schema";

const client = postgres(process.env.DATABASE_URL!);
const db = drizzle(client, { schema });

async function seed() {
  console.log("Seed məlumatları daxil edilir...");

  // Əvvəlki test məlumatlarını sil
  await db.delete(schema.transactions);
  await db.delete(schema.patients);

  // Xəstələr
  const insertedPatients = await db
    .insert(schema.patients)
    .values([
      {
        fullName: "Ayten Mammadova",
        age: 42,
        diagnosis: "Dos xercengi (III merhelesi)",
        hospitalName: "Milli Onkologiya Merkezi",
        contactPhone: "+994501234567",
        story:
          "Ayten xanim 3 usaq anasidir. 8 ay evvel diaqnoz qoyulub. Kimyevi terapiya davam edir, lakin derman xercleri ailenin imkanlarini asir.",
        goalAmount: "4500.00",
        collectedAmount: "2150.00",
        status: "active",
        isPublic: true,
      },
      {
        fullName: "Resad Aliyev",
        age: 58,
        diagnosis: "Agciyar xercengi (II merhelesi)",
        hospitalName: "N4 Xestexana, Baki",
        contactPhone: "+994702345678",
        story:
          "Resad muellim 30 illik muellim tecrubesine malikdir. Erken diaqnoz sayesinde mualiceye umid var, lakin emeliyyat ve sonraki mualice xercleri boyukdur.",
        goalAmount: "8000.00",
        collectedAmount: "1300.00",
        status: "active",
        isPublic: true,
      },
      {
        fullName: "Gunel Huseynova",
        age: 35,
        diagnosis: "Qalxanabenzar vezi xercengi",
        hospitalName: "Merkezi Klinik Xestexana",
        contactPhone: "+994551234567",
        story:
          "Gunel xanim cavan bir anadir. Diaqnoz erken merhelede tutulub — mualice sansi yuksekdir. Emeliyyat xerclerini odemek ucun desteyine ehtiyaci var.",
        goalAmount: "2800.00",
        collectedAmount: "2800.00",
        status: "funded",
        isPublic: true,
      },
      {
        fullName: "Mubariz Qasimov",
        age: 67,
        diagnosis: "Kolorektal xerceng (III merhelesi)",
        hospitalName: "Milli Onkologiya Merkezi",
        contactPhone: "+994603456789",
        story:
          "Mubariz bey teqaudcudur. Heyet yoldasi ile iki nefer yasayirlar. Uzun muddatli kimyevi terapiya teleb olunur.",
        goalAmount: "6200.00",
        collectedAmount: "890.00",
        status: "active",
        isPublic: true,
      },
    ])
    .returning();

  console.log(`${insertedPatients.length} xeste daxil edildi.`);

  // Emeliyyatlar
  const p = insertedPatients;

  await db.insert(schema.transactions).values([
    // Ayten - ianeler
    { patientId: p[0].id, type: "donation", amount: "500.00", donorName: "Elcin M.", isAnonymous: false },
    { patientId: p[0].id, type: "donation", amount: "1000.00", donorName: null, isAnonymous: true },
    { patientId: p[0].id, type: "donation", amount: "650.00", donorName: "Nigar H.", isAnonymous: false },
    // Ayten - xercler
    {
      patientId: p[0].id,
      type: "expense",
      amount: "380.00",
      category: "medication",
      description: "Taxol 30mg - 3 kurs",
      receiptUrl: null,
    },
    {
      patientId: p[0].id,
      type: "expense",
      amount: "120.00",
      category: "consultation",
      description: "Onkoloq konsultasiyasi",
      receiptUrl: null,
    },

    // Resad - ianeler
    { patientId: p[1].id, type: "donation", amount: "800.00", donorName: "Samir E.", isAnonymous: false },
    { patientId: p[1].id, type: "donation", amount: "500.00", donorName: null, isAnonymous: true },

    // Gunel - tam maliyyelesdi
    { patientId: p[2].id, type: "donation", amount: "1500.00", donorName: "Anar B.", isAnonymous: false },
    { patientId: p[2].id, type: "donation", amount: "1300.00", donorName: null, isAnonymous: true },
    {
      patientId: p[2].id,
      type: "expense",
      amount: "2800.00",
      category: "treatment",
      description: "Tiroidektomiya emeliyyati - N1 Klinika",
      receiptUrl: null,
    },

    // Mubariz - iane
    { patientId: p[3].id, type: "donation", amount: "890.00", donorName: "Kamran N.", isAnonymous: false },
  ]);

  console.log("Emeliyyatlar daxil edildi.");
  console.log("Seed tamamlandi!");
  await client.end();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
