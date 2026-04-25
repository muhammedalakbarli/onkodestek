import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Məxfilik siyasəti",
  description: "OnkoDəstək platformasının məxfilik siyasəti — şəxsi məlumatların toplanması, istifadəsi və qorunması.",
};

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <div className="mb-8">
          <Link href="/" className="text-sm text-blue-600 hover:underline">← Ana səhifə</Link>
          <h1 className="text-3xl font-bold text-slate-900 mt-4 mb-2">Məxfilik Siyasəti</h1>
          <p className="text-sm text-slate-400">Son yenilənmə: Aprel 2026</p>
        </div>

        <div className="prose prose-slate max-w-none space-y-8 text-slate-700 text-sm leading-relaxed">

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-3">1. Hansı məlumatları toplayırıq?</h2>
            <p>OnkoDəstək platformasından istifadə etdikdə aşağıdakı məlumatlar toplanır:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li><strong>Müraciət forması:</strong> Ad, soyad, telefon nömrəsi, xəstənin tibbi məlumatları</li>
              <li><strong>Google ilə giriş:</strong> Ad, e-poçt ünvanı, profil şəkli (Google tərəfindən verilir)</li>
              <li><strong>Telegram botu:</strong> Telegram istifadəçi ID-si, müraciət məlumatları</li>
              <li><strong>Texniki məlumatlar:</strong> IP ünvanı (spam mühafizəsi üçün), brauzer növü</li>
            </ul>
            <p className="mt-3 p-3 bg-amber-50 border border-amber-100 rounded-lg text-amber-800">
              <strong>Həssas məlumat:</strong> Xəstələrin tibbi sənədləri həssas şəxsi məlumat kateqoriyasına daxildir. Bu məlumatlar yalnız verifikasiya məqsədilə istifadə olunur və icazəsiz girişin qarşısını almaq üçün şifrələnmiş (encrypted) şəkildə saxlanılır.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-3">2. Məlumatları nə üçün istifadə edirik?</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>Müraciətləri yoxlamaq və platformada idarə etmək</li>
              <li>İzləmə kodu vasitəsilə müraciət statusunu göstərmək — izləmə kodu müraciətçinin şəxsi identifikasiyasını gizli saxlayaraq, ictimaiyyətə ianə gedişatını izləmək imkanı verir</li>
              <li>Donor hesabını idarə etmək və ianə tarixçəsini saxlamaq</li>
              <li>Spam və saxta müraciətlərin qarşısını almaq</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-3">3. Məlumatları kimlərlə paylaşırıq?</h2>
            <p>Şəxsi məlumatlarınız <strong>heç vaxt üçüncü tərəflərə satılmır</strong>. Yalnız aşağıdakı hallarda paylaşılır:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li><strong>Texniki xidmətlər:</strong> Vercel (hosting), Neon (verilənlər bazası), Google (autentifikasiya)</li>
              <li><strong>Qanuni tələblər:</strong> Məhkəmə qərarı və ya hüquq-mühafizə orqanlarının tələbi ilə</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-3">4. Məlumatlar nə qədər saxlanılır?</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>Müraciət məlumatları: platforma fəaliyyət göstərdiyi müddət</li>
              <li>İstifadəçi hesabı: hesab silindikdə şəxsi məlumatlar silinir, lakin maliyyə şəffaflığı və hesabatlılıq məqsədilə ianə məbləğləri anonim olaraq saxlanıla bilər</li>
              <li>IP ünvanları (rate limiting): 1 saat</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-3">5. Hüquqlarınız</h2>
            <p>Siz istənilən vaxt:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Saxlanılan məlumatlarınız haqqında məlumat ala bilərsiniz</li>
              <li>Məlumatlarınızın silinməsini tələb edə bilərsiniz</li>
              <li>Hesabınızı silə bilərsiniz</li>
            </ul>
            <p className="mt-3">Müraciət üçün: <a href="https://t.me/onkodestek_admin" className="text-blue-600 hover:underline">@onkodestek_admin</a></p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-3">6. Cookies</h2>
            <p>Platform yalnız autentifikasiya üçün zəruri cookies istifadə edir. Reklam və izləmə cookie-ləri istifadə edilmir.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-3">7. Hüquqi əsas</h2>
            <p>Bu siyasət Azərbaycan Respublikasının &quot;Fərdi məlumatlar haqqında&quot; qanununa və beynəlxalq data qorunması prinsiplərinə (GDPR) uyğun olaraq hazırlanmışdır.</p>
          </section>

        </div>
      </div>
      <Footer />
    </>
  );
}
