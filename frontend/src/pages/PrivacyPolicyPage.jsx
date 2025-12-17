import React from "react";
import { Shield, Lock, Eye, FileText, ArrowLeft, Mail } from "lucide-react";
import { Link } from "react-router";
import { Separator } from "@/components/ui/separator";
import Footer from "@/layouts/Footer";

const PrivacyPolicyPage = () => {
  const lastUpdated = "10 Desember 2025";

  return (
    <>
      <div className="w-full max-w-4xl mx-auto pb-12 px-4 sm:px-6">
        {/* header */}
        <div className="mb-3 mt-4 md:mt-8 flex items-center gap-2">
          {/* <Link
            to="/dashboard"
            className="group flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
          >
            <div className="p-1.5 rounded-full bg-white border border-gray-200 group-hover:border-primary/50 transition-colors">
              <ArrowLeft size={14} />
            </div>
            Kembali ke halaman utama
          </Link> */}
        </div>

        {/* main docs card */}
        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          {/* header */}
          <div className="bg-primary px-6 py-10 sm:px-10 sm:py-12 text-white relative overflow-hidden rounded-2xl sm:rounded-3xl">
            <div className="absolute top-0 right-0 p-32 bg-white/5 rounded-full blur-3xl transform translate-x-10 -translate-y-10"></div>

            <div className="relative z-10">
              <div className="flex items-center gap-2.5 mb-4 opacity-90">
                <Shield className="w-5 h-5 sm:w-6 sm:h-6" />
                <span className="text-xs sm:text-sm font-semibold tracking-widest bg-white/10 flex justify-center px-3 sm:px-4 py-1 rounded-md">
                  Legal & Keamanan
                </span>
              </div>

              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 sm:mb-4 leading-tight">
                Kebijakan Privasi
              </h1>

              <p className="text-purple-100 text-xs sm:text-base max-w-2xl leading-relaxed opacity-90">
                Di AI Learning Insight, kami menghargai privasi Anda sama
                besarnya dengan semangat belajar Anda. Dokumen ini menjelaskan
                transparansi pengelolaan data Anda.
              </p>
            </div>
          </div>

          {/* content body */}
          <div className="p-6 sm:p-10 space-y-8 sm:space-y-10">
            {/* metadata badge */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] sm:text-sm font-medium text-gray-500 bg-gray-50 px-4 py-3 rounded-xl border border-gray-100">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                Status: Berlaku Efektif
              </span>
              <span>
                Terakhir diperbarui: {lastUpdated} &nbsp;•&nbsp; v1.0.0
              </span>
            </div>

            {/* section 1 */}
            <section className="space-y-3 sm:space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#EEF2FF] flex items-center justify-center text-primary shrink-0">
                  <FileText size={18} className="sm:w-5 sm:h-5" />
                </div>
                <h2 className="text-base sm:text-xl font-bold text-gray-900">
                  Informasi yang Kami Kumpulkan
                </h2>
              </div>
              <div className="pl-0 sm:pl-[3.25rem] text-sm sm:text-base text-gray-600 leading-7">
                <p className="mb-3">
                  Untuk memberikan analisis gaya belajar yang akurat, kami
                  mengumpulkan beberapa jenis data saat Anda menggunakan
                  platform:
                </p>
                <ul className="list-disc pl-5 space-y-2 marker:text-primary/70">
                  <li>
                    <strong className="text-gray-800 font-semibold">
                      Data Identitas:
                    </strong>{" "}
                    Nama/Username, alamat email, dan informasi profil dasar untuk
                    personalisasi sapaan.
                  </li>
                  <li>
                    <strong className="text-gray-800 font-semibold">
                      Data Aktivitas Belajar:
                    </strong>{" "}
                    Waktu yang dihabiskan pada materi, skor pretest, dan pola
                    interaksi.
                  </li>
                  <li>
                    <strong className="text-gray-800 font-semibold">
                      Data Perangkat:
                    </strong>{" "}
                    Informasi teknis browser untuk memastikan tampilan responsif
                    yang optimal.
                  </li>
                </ul>
              </div>
            </section>

            <Separator className="bg-gray-100" />

            {/* section 2 */}
            <section className="space-y-3 sm:space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#EEF2FF] flex items-center justify-center text-primary shrink-0">
                  <Eye size={18} className="sm:w-5 sm:h-5" />
                </div>
                <h2 className="text-base sm:text-xl font-bold text-gray-900">
                  Penggunaan Kecerdasan Buatan (AI)
                </h2>
              </div>

              <div className="pl-0 sm:pl-[3.25rem] space-y-4">
                <p className="text-sm sm:text-base text-gray-600 leading-7">
                  Fitur utama kami, <strong>Actionable Insight</strong>,
                  menggunakan algoritma <em>Machine Learning</em> untuk
                  menganalisis pola belajar Anda secara otomatis.
                </p>

                {/* highlight box */}
                <div className="bg-[#FDFDFF] border border-primary/10 rounded-xl p-4 sm:p-5">
                  <h4 className="font-bold text-primary text-sm sm:text-base mb-2 flex items-center gap-2">
                    Bagaimana data diproses?
                  </h4>
                  <p className="mb-3 text-sm text-gray-600 leading-relaxed">
                    Data aktivitas diubah menjadi vektor numerik anonim (tanpa
                    identitas) yang diproses model AI untuk menentukan:
                  </p>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-4 list-disc text-sm text-gray-600 marker:text-gray-400">
                    <li>Gaya Belajar Dominan.</li>
                    <li>Konsistensi Belajar.</li>
                    <li>Rekomendasi/Tips Belajar yang lebih efisien/efektif.</li>
                  </ul>
                  <p className="mt-4 pt-3 border-t border-primary/10 text-[11px] sm:text-xs text-gray-400 italic">
                    *Kami tidak menggunakan data profil pribadi Anda untuk
                    melatih model AI publik.
                  </p>
                </div>
              </div>
            </section>

            <Separator className="bg-gray-100" />

            {/* section 3 */}
            <section className="space-y-3 sm:space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#EEF2FF] flex items-center justify-center text-primary shrink-0">
                  <Lock size={18} className="sm:w-5 sm:h-5" />
                </div>
                <h2 className="text-base sm:text-xl font-bold text-gray-900">
                  Keamanan Data
                </h2>
              </div>
              <div className="pl-0 sm:pl-[3.25rem] text-sm sm:text-base text-gray-600 leading-7">
                <p className="mb-4">
                  Kami menerapkan standar keamanan industri:
                </p>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <li className="flex items-center gap-3 p-3 sm:p-4 rounded-xl border border-gray-100 bg-gray-50/50">
                    <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]"></div>
                    <span className="font-medium text-gray-700 text-sm">
                      Enkripsi SSL/TLS
                    </span>
                  </li>
                  <li className="flex items-center gap-3 p-3 sm:p-4 rounded-xl border border-gray-100 bg-gray-50/50">
                    <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]"></div>
                    <span className="font-medium text-gray-700 text-sm">
                      Database Terenkripsi
                    </span>
                  </li>
                </ul>
              </div>
            </section>

            {/* footer */}
            <div className="mt-12 p-6 sm:p-8 bg-[#F8F9FA] rounded-2xl text-center border border-gray-100">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-primary mx-auto mb-4 shadow-sm border border-gray-100">
                <Mail size={20} />
              </div>
              <h4 className="font-bold text-gray-900 text-base sm:text-lg mb-2">
                Masih memiliki pertanyaan?
              </h4>
              <p className="text-sm text-gray-500 mb-6 max-w-md mx-auto leading-relaxed">
                Tim Data Protection kami siap membantu menjelaskan bagaimana
                data Anda dikelola.
              </p>
              <a
                href="mailto:privacy@ailearning.com"
                className="inline-flex items-center justify-center px-6 py-2.5 rounded-xl bg-white border border-gray-200 text-sm font-semibold text-gray-700 hover:border-primary hover:text-primary hover:shadow-sm transition-all"
              >
                Hubungi via Email
              </a>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default PrivacyPolicyPage;
