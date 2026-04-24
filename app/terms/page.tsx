import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";

export const metadata: Metadata = {
  title: "İstifadə şərtləri",
  description: "onkodəstək platformasının istifadə şərtləri.",
};

export default function TermsPage() {
  return (
    <>
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <div className="mb-8">
          <Link href="/" className="text-sm text-blue-600 hover:underline">← Ana səhifə</Link>
          <h1 className="text-3xl font-bold text-slate-900 mt-4 mb-2">İstifadə Şərtləri</h1>
          <p className="text-sm text-slate-400">Son yenilənmə: Aprel 2026</p>
        </div>

        <div className="space-y-8 text-slate-700 text-sm leading-relaxed">

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-3">1. Platformanın məqsədi</h2>
            <p>onkodəstək — Azərbaycanda onkoloji xəstəliklərlə mübarizə aparan şəxslərə şəffaf şəkildə maddi dəstək göstərmək üçün nəzərdə tutulmuş könüllü xeyriyyəçilik platformasıdır.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-3">2. Müraciət şərtləri</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>Müraciət edən şəxs xəstə və ya onun ailə üzvü olmalıdır</li>
              <li>Tibbi sənədlər (xəstəxana arayışı, diaqnoz) tələb olunur</li>
              <li>Yanlış məlumat vermək müraciətin ləğvinə səbəb olur</li>
              <li>Komanda müraciəti qəbul etməmək hüququnu özündə saxlayır</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-3">3. Vəsaitin istifadəsi</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>Toplanmış vəsait yalnız müalicə xərcləri üçün istifadə edilir</li>
              <li>Hər xərc rəsmi qəbzlə sənədləşdirilir</li>
              <li>Artıq qalan vəsait başqa aktiv kampaniyaya yönəldilir və ya xəstəyə qaytarılır</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-3">4. İanəçi məsuliyyəti</h2>
            <p>İanə etməklə siz:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Vəsaitin xeyriyyəçilik məqsədi ilə istifadə ediləcəyini qəbul edirsiniz</li>
              <li>İanənin geri qaytarılmayacağını anlayırsınız (fövqəladə hallarda əlaqə saxlayın)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-3">5. Platformanın məhdudiyyətləri</h2>
            <p>onkodəstək könüllü əsasda fəaliyyət göstərən bir platformadır və aşağıdakılara zəmanət vermir:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Hədəf məbləğin tam yığılacağı</li>
              <li>Müalicənin uğurlu olacağı</li>
              <li>Platformanın fasiləsiz işləyəcəyi</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-3">6. Əlaqə</h2>
            <p>Şərtlərə dair suallar üçün: <a href="https://t.me/onkodestek_admin" className="text-blue-600 hover:underline">@onkodestek_admin</a></p>
          </section>

        </div>
      </div>
      <Footer />
    </>
  );
}
