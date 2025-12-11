import React, { useState } from "react";
import {
  Filter,
  ArrowUpRight,
  ClipboardCheck,
  BookOpen,
  BrainCircuit,
  ChevronLast,
  History,
  CalendarDays,
  X,
} from "lucide-react";
import { Link } from "react-router";
import ContentDrawer from "@/components/reusable/ContentDrawer";
import { Separator } from "@/components/ui/separator";
import { HistoryDetailModal } from "@/components/modals/HistoryDetailModal";
import { LearningPatternModal } from "@/components/modals/LearningPatternModal";

// import { HistoryDetailModal } from "@/components/pretest/HistoryDetailModal";

const historyData = [
  {
    id: 1,
    date: "10 Des 2025",
    patternResult: "Consistent Learner",
    styleResult: "Visual",
    score: 92,
    status: "Selesai",
    duration: "15 Menit",
    styleBreakdown: { visual: 4, auditory: 1, kinesthetic: 1 },
    summary:
      "Anda memiliki ritme belajar yang sangat stabil dengan preferensi materi visual.",
  },
  {
    id: 2,
    date: "12 Nov 2025",
    patternResult: "Fast Learner",
    styleResult: "Auditory",
    score: 78,
    status: "Selesai",
    duration: "08 Menit",
    styleBreakdown: { visual: 1, auditory: 4, kinesthetic: 1 },
    summary:
      "Sangat cepat memahami konsep baru terutama melalui penjelasan lisan.",
  },
  {
    id: 3,
    date: "05 Okt 2025",
    patternResult: "Reflective Learner",
    styleResult: "Kinesthetic",
    score: 85,
    status: "Selesai",
    duration: "25 Menit",
    styleBreakdown: { visual: 1, auditory: 1, kinesthetic: 4 },
    summary: "Butuh waktu untuk mendalami materi melalui praktik langsung.",
  },
  {
    id: 4,
    date: "28 Sep 2025",
    patternResult: "-",
    styleResult: "-",
    score: 0,
    status: "Draft",
    duration: "-",
    styleBreakdown: { visual: 0, auditory: 0, kinesthetic: 0 },
    summary: "Tes belum diselesaikan.",
  },
  {
    id: 5,
    date: "15 Sep 2025",
    patternResult: "Balanced Learner",
    styleResult: "Visual",
    score: 88,
    status: "Selesai",
    duration: "14 Menit",
    styleBreakdown: { visual: 3, auditory: 2, kinesthetic: 1 },
    summary: "Keseimbangan yang baik antara kecepatan dan ketelitian.",
  },
];

const Pretest = () => {
  const [isPatternModalOpen, setIsPatternModalOpen] = useState(false);
  const [selectedHistory, setSelectedHistory] = useState(null);

  return (
    <ContentDrawer>
      {isPatternModalOpen && (
        <LearningPatternModal
          isOpen={!!isPatternModalOpen}
          onClose={() => setIsPatternModalOpen(false)}
        />
      )}
      <HistoryDetailModal
        isOpen={!!selectedHistory}
        data={selectedHistory}
        onClose={() => setSelectedHistory(null)}
      />

      {/* main layout */}
      <div className="flex flex-col lg:flex-row gap-6 w-full h-full relative">
        {/* left */}
        <section className="flex-1 flex flex-col justify-center gap-6 min-w-0">
          <article className="bg-white rounded-3xl p-1 flex flex-col shadow-none border-none h-full">
            <div className="p-5 px-4 sm:p-6 flex flex-col h-full">
              <header className="mb-6 sm:mb-8">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                  Ketahui Pola Belajarmu!
                </h2>
                <p className="text-gray-500 text-sm sm:text-base leading-relaxed">
                  Isi 15 pertanyaan (9 Pola + 6 Gaya) untuk mendapatkan profil
                  belajar yang akurat!
                </p>
              </header>
              {/*  */}
              <div className="flex flex-col gap-5 sm:gap-6 flex-1">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <button
                    onClick={() => setIsPatternModalOpen(true)}
                    className="text-left border sm:border-[1.5px] border-primary/15 bg-[#FDFDFF] hover:bg-purple-50/60 hover:border-primary/40 rounded-2xl p-5 flex flex-col gap-3 transition-all duration-300 group shadow-sm  h-full"
                  >
                    <div className="w-10 h-10 rounded-full border border-purple-200 bg-purple-50 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-colors duration-300">
                      <BrainCircuit size={20} />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-primary">
                        Pola Belajar
                      </h3>
                      <div className="text-[#8A8A8A] text-xs sm:text-sm mt-1 group-hover:text-primary/70 transition-colors duration-300">
                        Consistent, Fast, Reflective dan Balanced.
                      </div>
                    </div>
                  </button>
                  {/*  */}
                  <Link
                    to="#"
                    className="border sm:border-[1.5px] border-primary/15 bg-[#FDFDFF] hover:bg-purple-50/60 hover:border-primary/40 rounded-2xl p-5 flex flex-col gap-3 transition-all duration-300 group shadow-sm  h-full"
                  >
                    <div className="w-10 h-10 rounded-full border border-purple-200 bg-purple-50 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-colors duration-300">
                      <BookOpen size={20} />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-primary">
                        Gaya Belajar
                      </h3>
                      <div className="text-[#8A8A8A] text-xs sm:text-sm mt-1 group-hover:text-primary/70 transition-colors duration-300">
                        Visual, Auditori dan Kinestetik.
                      </div>
                    </div>
                  </Link>
                </div>
                <div className="mt-0 pt-0 sm:pt-0">
                  <Link
                    to="/dashboard/pretest/start-quiz"
                    className="w-full bg-primary hover:bg-[#352a5e] text-white rounded-2xl p-6 sm:p-6 flex items-center gap-6 transition-all duration-300 shadow-md hover:shadow-lg shadow-purple-900/10 group"
                  >
                    <div className="w-12 h-12 sm:w-14 sm:h-16 border-2 border-white/20 bg-white/10 rounded-xl flex items-center justify-center ml-2">
                      <ClipboardCheck
                        size={28}
                        className="text-white sm:w-8 sm:h-8"
                      />
                    </div>
                    <div className="text-left py-2 sm:py-4">
                      <span className="block text-lg sm:text-xl font-bold mb-1">
                        Mulai
                      </span>
                      <span className="flex items-center text-purple-200 text-xs sm:text-sm">
                        Mengisi 15 Soal{" "}
                        <span className="ml-2 transform group-hover:translate-x-1 transition-transform duration-300">
                          <ChevronLast
                            size={16}
                            className="mt-[0.1rem] sm:mt-[0.2rem]"
                          />
                        </span>
                      </span>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </article>
        </section>

        <div className="lg:hidden px-4">
          <Separator className="bg-gray-100" />
        </div>

        {/* right */}
        <section
          className="w-full lg:w-[380px] flex-shrink-0 mt-4 sm:mt-0"
          aria-label="Riwayat Pretest"
        >
          <div className="bg-white rounded-2xl overflow-hidden shadow-sm flex flex-col h-[500px] lg:h-full lg:max-h-[calc(100vh-100px)]">
            {/*  */}
            <header className="px-6 py-5 flex rounded-2xl justify-between items-center bg-primary text-white w-[90%] sm:w-full shrink-0 mx-auto z-10">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm">
                  <History size={18} className="text-purple-100" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg sm:text-lg leading-tight">
                    Riwayat
                  </h3>
                  <p className="text-[11px] text-purple-200 opacity-80">
                    Aktivitas tes terakhirmu
                  </p>
                </div>
              </div>
              {/* <button className="group flex items-center gap-2 bg-white/10 hover:bg-white/20 px-3 py-2 rounded-xl text-xs font-medium transition-all duration-200 border border-white/5 active:scale-95">
                Filter{" "}
                <Filter
                  size={12}
                  className="opacity-70 group-hover:opacity-100"
                />
              </button> */}
            </header>
            {/* lists */}
            <div className="flex-1 bg-[#FDFDFF] relative">
              <div className="absolute inset-0 overflow-y-auto minimal-scroll p-4 px-5 sm:p-5 space-y-3">
                {historyData.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => setSelectedHistory(item)}
                    className="group relative flex items-center justify-between bg-white border border-gray-100 hover:border-primary/30 hover:bg-purple-50/40 p-4 rounded-2xl transition-all duration-300 shadow-sm  cursor-pointer"
                  >
                    <div
                      className={`absolute left-0 top-3 bottom-3 w-1 rounded-r-full transition-colors duration-300 ${
                        item.status === "Selesai"
                          ? "bg-green-400/80 group-hover:bg-green-500"
                          : "bg-gray-300/80 group-hover:bg-gray-400"
                      }`}
                    ></div>
                    <div className="flex flex-col gap-1.5 pl-3 w-full">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider font-bold text-gray-400 bg-gray-50 px-2 py-0.5 rounded-md w-fit group-hover:bg-white transition-colors duration-300">
                          <CalendarDays size={10} />
                          {item.date}
                        </div>
                        <ArrowUpRight
                          size={14}
                          className="text-gray-300 lg:hidden group-hover:text-primary transition-colors duration-300"
                        />
                      </div>
                      {/* Judul Pattern */}
                      <h4
                        className={`font-bold text-sm truncate pr-2 transition-colors duration-300 ${
                          item.status === "Draft"
                            ? "text-gray-400 italic group-hover:text-gray-600"
                            : "text-primary group-hover:text-[#2e2555]"
                        }`}
                      >
                        {item.status === "Draft"
                          ? "Draft Tersimpan"
                          : item.patternResult}
                      </h4>
                      <div className="flex items-center gap-2 mt-0.5">
                        {item.status === "Selesai" ? (
                          // Badge Style
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#EDE8FA] text-primary border border-primary/10 group-hover:border-primary/30 transition-colors duration-300">
                            {item.styleResult} • {item.score}%
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-gray-100 text-gray-500 border border-gray-200 group-hover:border-gray-300 transition-colors duration-300">
                            Lanjutkan
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="hidden lg:flex w-fit rounded-full p-1 items-center justify-center bg-gray-50 text-gray-300 border border-gray-100 transition-colors duration-300">
                      <ArrowUpRight size={16} />
                    </div>
                  </div>
                ))}
                <div className="pt-4 pb-2 text-center">
                  <p className="text-[10px] font-medium text-gray-300 uppercase tracking-widest">
                    Menampilkan 5 Terakhir
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </ContentDrawer>
  );
};

export default Pretest;
