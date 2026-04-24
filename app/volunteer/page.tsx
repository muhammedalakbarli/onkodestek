import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import VolunteerForm from "./VolunteerForm";

export const metadata: Metadata = {
  title: "Könüllü ol — onkodəstək",
  description: "Bacarıqlarınızla onkoloji xəstələrə dəstək olun. Tibbi, hüquqi, texniki, media sahəsində könüllü formu doldurun.",
};

export default function VolunteerPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-slate-50">

        {/* Hero */}
        <div className="bg-gradient-to-br from-blue-900 via-teal-800 to-blue-900 py-14 px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 mb-5">
              <svg className="w-4 h-4 text-teal-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
              </svg>
              <span className="text-teal-200 text-sm font-medium">Könüllülük</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-3">
              Fərq yaradın
            </h1>
            <p className="text-teal-100/80 text-sm max-w-md mx-auto">
              Bacarıqlarınızla xəstələrə, ailələrə və platformamıza dəstək olun.
              Birlikdə daha çox insana çatmaq mümkündür.
            </p>
          </div>
        </div>

        <VolunteerForm />

      </main>
      <Footer />
    </>
  );
}
