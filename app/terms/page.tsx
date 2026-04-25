import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";

export const metadata: Metadata = {
  title: "İstifadə Şərtləri — OnkoDəstək",
  description: "OnkoDəstək platformasının istifadə şərtləri. Platformadan istifadə etməklə bu şərtləri qəbul etmiş olursunuz.",
};

const LAST_UPDATED = "Aprel 2026";

const sections = [
  {
    id: "general",
    title: "1. Ümumi Müddəalar",
    content: `OnkoDəstək ("Platforma") Azərbaycanda onkoloji xəstəliklə mübarizə aparan xəstələrə şəffaf maliyyə dəstəyi göstərmək məqsədilə yaradılmış qeyri-kommersiya xeyriyyəçilik platformasıdır.

Platformadan istifadə etməklə siz bu İstifadə Şərtlərini oxuduğunuzu, başa düşdüyünüzü və qəbul etdiyinizi təsdiqləyirsiniz. Bu şərtləri qəbul etmirsinizsə, platformadan istifadə etməkdən çəkinin.`,
  },
  {
    id: "eligibility",
    title: "2. İstifadəçi Tələbləri",
    items: [
      "18 yaşını tamamlamış olmalısınız (və ya qanuni nümayəndənin razılığı ilə)",
      "Azərbaycan Respublikasının qüvvədə olan qanunvericiliyinə uyğun hərəkət etməlisiniz",
      "Düzgün və tam məlumat təqdim etməlisiniz",
      "Platformanı yalnız qanuni məqsədlər üçün istifadə etməlisiniz",
    ],
  },
  {
    id: "applications",
    title: "3. Yardım Müraciətləri",
    items: [
      "Təqdim etdiyiniz bütün məlumatlar (şəxsi məlumatlar, tibbi sənədlər, xəstəliyin təsviri) doğru və həqiqi olmalıdır",
      "Yanlış məlumat vermək müraciətin rədd edilməsinə və hüquqi məsuliyyətə səbəb ola bilər",
      "Tibbi sənədlər platforma komandası tərəfindən yoxlanılacaq; bu proses müəyyən müddət tələb edə bilər",
      "Müraciətin qəbul edilib-edilməməsi barədə qərar müstəqil olaraq platforma tərəfindən verilir",
      "Müraciətiniz rədd edilərsə, yenidən müraciət etmək hüququnuz qorunur",
    ],
  },
  {
    id: "funds",
    title: "4. Vəsaitin İstifadəsi",
    items: [
      "Toplanmış bütün vəsaitlər yalnız xəstənin tibbi ehtiyacları üçün istifadə edilir",
      "Hər xərc rəsmi qəbz və hesabat sənədi ilə əsaslandırılır",
      "Maliyyə hesabatları platforma üzərindən ictimaiyyətə açıqdır",
      "Heç bir ianə inzibati xərclər üçün yönləndirilmir",
      "Hədəfdən artıq toplanan vəsait digər aktiv xəstəyə yönləndirilir və ya donora qaytarılır",
    ],
  },
  {
    id: "prohibited",
    title: "5. Qadağan Edilmiş Hərəkətlər",
    items: [
      "Yanlış, aldadıcı və ya saxta məlumat vermək",
      "Başqasının adından müraciət göndərmək (xəstənin yazılı razılığı olmadan)",
      "Platformanın texniki infrastrukturuna zərər vermək cəhdi",
      "Digər istifadəçilərin şəxsi məlumatlarına icazəsiz daxil olmaq",
      "Platformanı spam, reklam və ya kommersiya məqsədləri üçün istifadə etmək",
    ],
  },
  {
    id: "liability",
    title: "6. Məsuliyyətin Məhdudlaşdırılması",
    items: [
      "Xəstəlik diaqnozunun düzgünlüyünə zəmanət vermir — bu, xəstənin müalicə aparan həkiminin məsuliyyətidir",
      "Toplanan vəsaitin xəstənin tam sağalmasını təmin edəcəyinə zəmanət vermir",
      "Xidmət fasilələrindən, texniki xətalardan irəli gələn zərərlərə görə məsuliyyət daşımır",
      "Platformanı istifadəçi tərəfindən düzgün istifadə edilməməsindən doğan zərərlərə görə məsuliyyət daşımır",
    ],
    prefix: "OnkoDəstək:",
  },
  {
    id: "privacy",
    title: "7. Şəxsi Məlumatlar",
    content: `Şəxsi məlumatlarınız Məxfilik Siyasətimizə uyğun olaraq emal edilir. Platformada topladığımız məlumatlar (ad, əlaqə, tibbi sənədlər) üçüncü şəxslərə satılmır, yalnız xidmətin göstərilməsi üçün istifadə edilir.`,
    link: { href: "/privacy", label: "Məxfilik Siyasətini oxu" },
  },
  {
    id: "changes",
    title: "8. Şərtlərin Dəyişdirilməsi",
    content: `Bu şərtlər zəruri hallarda yenilənə bilər. Əhəmiyyətli dəyişikliklər haqqında istifadəçilər platforma daxilindəki bildiriş vasitəsilə məlumatlandırılacaq. Dəyişikliklərdən sonra platformadan istifadəyə davam etmək yeni şərtləri qəbul etmək kimi qiymətləndirilir.`,
  },
  {
    id: "contact",
    title: "9. Əlaqə",
    content: "Bu şərtlərlə bağlı suallarınız varsa Telegram üzərindən bizimlə əlaqə saxlaya bilərsiniz:",
    link: { href: "https://t.me/onkodestek_admin", label: "@onkodestek_admin", external: true },
  },
];

export default function TermsPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-slate-50">

        {/* Hero */}
        <div className="bg-gradient-to-br from-blue-900 via-teal-800 to-blue-900 py-14 px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 mb-5">
              <svg className="w-4 h-4 text-teal-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span className="text-teal-200 text-sm font-medium">Hüquqi Sənəd</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-3">
              İstifadə Şərtləri
            </h1>
            <p className="text-teal-100/70 text-sm">Son yenilənmə: {LAST_UPDATED}</p>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-4 py-12">

          {/* Quick nav */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 mb-10 shadow-sm">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">Mündəricat</p>
            <div className="grid sm:grid-cols-2 gap-x-6 gap-y-1">
              {sections.map((s) => (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  className="text-sm text-slate-600 hover:text-teal-600 py-1 hover:underline underline-offset-2 transition-colors"
                >
                  {s.title}
                </a>
              ))}
            </div>
          </div>

          {/* Sections */}
          <div className="space-y-10">
            {sections.map((s) => (
              <section key={s.id} id={s.id} className="scroll-mt-6 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                <h2 className="text-base font-bold text-slate-900 mb-4 pb-3 border-b border-slate-100">
                  {s.title}
                </h2>

                {s.prefix && (
                  <p className="text-sm text-slate-600 mb-2">{s.prefix}</p>
                )}

                {s.content && (
                  <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line mb-3">
                    {s.content}
                  </p>
                )}

                {s.items && (
                  <ul className="space-y-2">
                    {s.items.map((item, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm text-slate-600">
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-teal-500 shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                )}

                {s.link && (
                  <div className="mt-3">
                    {s.link.external ? (
                      <a
                        href={s.link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-sm text-teal-600 hover:text-teal-700 font-medium hover:underline underline-offset-2"
                      >
                        {s.link.label}
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                    ) : (
                      <Link
                        href={s.link.href}
                        className="inline-flex items-center gap-1.5 text-sm text-teal-600 hover:text-teal-700 font-medium hover:underline underline-offset-2"
                      >
                        {s.link.label}
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    )}
                  </div>
                )}
              </section>
            ))}
          </div>

          {/* Bottom */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-slate-200">
            <p className="text-sm text-slate-500 text-center sm:text-left">
              Platformadan istifadə edərək bu şərtləri qəbul etmiş olursunuz.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors"
            >
              Ana səhifəyə qayıt
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
