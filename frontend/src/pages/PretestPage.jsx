import React, { useState, useEffect } from "react";
import {
  ClipboardCheck,
  BookOpen,
  BrainCircuit,
  ChevronLast,
} from "lucide-react";
import { Link } from "react-router";
import ContentDrawer from "@/components/reusable/ContentDrawer";
import { Separator } from "@/components/ui/separator";
import { HistoryDetailModal } from "@/components/modals/HistoryDetailModal";
import { LearningPatternModal } from "@/components/modals/LearningPatternModal";
import { TestHistory } from "./pretest/TestHistory";
import { resultService } from "@/services/result.service";

const Pretest = () => {
  const [isPatternModalOpen, setIsPatternModalOpen] = useState(false);
  const [selectedHistory, setSelectedHistory] = useState(null);
  const [historyList, setHistoryList] = useState([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);

  const handleSelectHistory = async (historySnapshot) => {
    try {
      setSelectedHistory({ ...historySnapshot, isLoading: true });

      const res = await resultService.getHistoryDetail(historySnapshot.id);

      setSelectedHistory({
        ...res.data,
        isLoading: false,
        summary:
          res.data.summary || "Laporan gabungan Pola Belajar dan Gaya Belajar.",
      });
    } catch (error) {
      console.error("Gagal mengambil detail riwayat:", error);
      setSelectedHistory(null);
    }
  };

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await resultService.getHistory();
        const formattedData = res.data.map((item) => ({
          ...item,
          date: new Date(item.timestamp).toLocaleDateString("id-ID", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          }),
        }));
        setHistoryList(formattedData);
      } catch (error) {
        console.error("Gagal mengambil daftar riwayat:", error);
      } finally {
        setIsLoadingHistory(false);
      }
    };

    fetchHistory();
  }, []);

  return (
    <ContentDrawer>
      {isPatternModalOpen && (
        <LearningPatternModal
          isOpen={!!isPatternModalOpen}
          onClose={() => setIsPatternModalOpen(false)}
        />
      )}
      <HistoryDetailModal
        isOpen={!!selectedHistory && !selectedHistory.isLoading}
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
              {/* */}
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
                      <h3 className="font-semibold text-lg text-primary">
                        Pola Belajar
                      </h3>
                      <div className="text-[#8A8A8A] text-xs sm:text-sm mt-1 group-hover:text-primary/70 transition-colors duration-300">
                        Consistent, Fast, Reflective dan Balanced.
                      </div>
                    </div>
                  </button>
                  {/* */}
                  <Link
                    to="#"
                    className="border sm:border-[1.5px] border-primary/15 bg-[#FDFDFF] hover:bg-purple-50/60 hover:border-primary/40 rounded-2xl p-5 flex flex-col gap-3 transition-all duration-300 group shadow-sm  h-full"
                  >
                    <div className="w-10 h-10 rounded-full border border-purple-200 bg-purple-50 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-colors duration-300">
                      <BookOpen size={20} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg text-primary">
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
                    to="/dashboard/pretest/test"
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
        {/* tests history */}
        <TestHistory
          historyData={historyList}
          isLoading={isLoadingHistory}
          onSelectHistory={handleSelectHistory}
        />
      </div>
    </ContentDrawer>
  );
};

export default Pretest;
