import React from "react";
import {
  X,
  CalendarDays,
  AlertCircle,
  Repeat,
  Zap,
  Search,
  Scale,
  BrainCircuit,
  Eye,
  Ear,
  Hand,
  Award,
} from "lucide-react";

export const HistoryDetailModal = ({ isOpen, data, onClose, isClosing }) => {
  if (!isOpen || !data) return null;

  const getPatternIcon = (type) => {
    if (!type) return <BrainCircuit size={20} />;
    const lowerType = type.toLowerCase();

    if (lowerType.includes("consistent") || lowerType.includes("planner"))
      return <Repeat size={20} />;
    if (lowerType.includes("fast") || lowerType.includes("quick"))
      return <Zap size={20} />;
    if (lowerType.includes("reflective") || lowerType.includes("reflektif"))
      return <Search size={20} />;
    if (lowerType.includes("balanced")) return <Scale size={20} />;

    // Default Icon
    return <Award size={20} />;
  };

  const calculatePercentage = (val) => {
    const scores = data.styleBreakdown || {};

    const v = scores.visual || 0;
    const a = scores.auditori || 0;
    const k = scores.kinestetik || 0;

    const totalScore = v + a + k;
    if (totalScore === 0) return 0;

    const safeVal = val || 0;
    return Math.round((safeVal / totalScore) * 100);
  };

  const displayData = data.isLoading
    ? {
        date: "Memuat...",
        status: "Loading",
        patternResult: "Memuat Pola...",
        styleResult: "Memuat Gaya...",
        score: 0,
        styleBreakdown: { visual: 0, auditori: 0, kinestetik: 0 },
        summary: "Sedang mengambil data lengkap hasil tes...",
      }
    : data;

  return (
    <div
      onClick={onClose}
      className={`
        fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm 
        transition-all duration-300 ease-in-out
        ${
          isClosing || displayData.isLoading
            ? "opacity-0 pointer-events-none"
            : "opacity-100"
        } 
      `}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`
          bg-white rounded-[1.2rem] shadow-2xl w-full max-w-lg overflow-hidden flex flex-col 
          transform transition-all duration-300 ease-in-out
          ${
            isClosing || displayData.isLoading
              ? "scale-95 translate-y-4 opacity-0"
              : "scale-100 translate-y-0 opacity-100"
          }
        `}
      >
        {/* header */}
        <div className="relative bg-[#3F3370] p-6 text-white overflow-hidden shrink-0">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 blur-2xl"></div>
          <div className="relative z-10 flex justify-between items-start">
            <div>
              <h3 className="text-xl font-semibold">Laporan Hasil Tes</h3>
              <p className="text-purple-200 text-xs mt-1 flex items-center gap-1.5 opacity-90">
                <CalendarDays size={12} /> {displayData.date}
              </p>
            </div>
            <button
              onClick={onClose}
              className="bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors backdrop-blur-sm"
            >
              <X size={18} className="text-white" />
            </button>
          </div>
        </div>

        {/* body */}
        <div className="p-6 space-y-6 overflow-y-auto max-h-[70vh] minimal-scroll">
          {displayData.patternResult && displayData.styleBreakdown ? (
            <>
              {/* learning pattern */}
              <div className="bg-[#FDFDFF] border border-gray-100 p-5 rounded-2xl shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 p-3 opacity-5">
                  <BrainCircuit size={80} />
                </div>
                <p className="text-xs text-primary font-semibold mb-3 flex items-center gap-2 text-[#3F3370]">
                  Pola Belajar
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 shrink-0 rounded-full bg-purple-50 text-[#3F3370] flex items-center justify-center border border-purple-100">
                    {getPatternIcon(displayData.patternResult)}
                  </div>
                  <div>
                    <h4 className="text-lg sm:text-xl font-bold text-gray-800 capitalize">
                      {displayData.patternResult || "-"}
                    </h4>
                    <p className="text-xs text-gray-500 mt-1">
                      Karakteristik pola belajar Anda saat ini.
                    </p>
                  </div>
                </div>
              </div>

              {/* learning style */}
              <div className="space-y-4 px-1">
                <p className="text-xs sm:text-sm text-gray-400 font-semibold flex items-center gap-2 px-0">
                  Dominasi Gaya Belajar (Skor Total)
                </p>

                <div className="space-y-4">
                  {/* Visual */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs sm:text-sm font-medium">
                      <span className="flex items-center gap-2 text-gray-700">
                        <Eye size={14} className="text-blue-500" /> Visual
                      </span>
                      <span className="text-gray-900 font-bold">
                        {calculatePercentage(
                          displayData.styleBreakdown?.visual
                        )}
                        %
                        <span className="font-normal text-gray-400 ml-1 text-[10px]">
                          ({displayData.styleBreakdown?.visual || 0} pts)
                        </span>
                      </span>
                    </div>
                    <div className="h-2.5 w-full bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500 rounded-full transition-all duration-1000 ease-out"
                        style={{
                          width: `${calculatePercentage(
                            displayData.styleBreakdown?.visual
                          )}%`,
                        }}
                      ></div>
                    </div>
                  </div>

                  {/* auditori */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs sm:text-sm font-medium">
                      <span className="flex items-center gap-2 text-gray-700">
                        <Ear size={14} className="text-pink-500" /> Auditory
                      </span>
                      <span className="text-gray-900 font-bold">
                        {calculatePercentage(
                          displayData.styleBreakdown?.auditori
                        )}
                        %
                        <span className="font-normal text-gray-400 ml-1 text-[10px]">
                          ({displayData.styleBreakdown?.auditori || 0} pts)
                        </span>
                      </span>
                    </div>
                    <div className="h-2.5 w-full bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-pink-500 rounded-full transition-all duration-1000 ease-out"
                        style={{
                          width: `${calculatePercentage(
                            displayData.styleBreakdown?.auditori
                          )}%`,
                        }}
                      ></div>
                    </div>
                  </div>

                  {/* Kinestetik */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs sm:text-sm font-medium">
                      <span className="flex items-center gap-2 text-gray-700">
                        <Hand size={14} className="text-orange-500" />
                        Kinesthetic
                      </span>
                      <span className="text-gray-900 font-bold">
                        {calculatePercentage(
                          displayData.styleBreakdown?.kinestetik
                        )}
                        %
                        <span className="font-normal text-gray-400 ml-1 text-[10px]">
                          ({displayData.styleBreakdown?.kinestetik || 0} pts)
                        </span>
                      </span>
                    </div>
                    <div className="h-2.5 w-full bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-orange-500 rounded-full transition-all duration-1000 ease-out"
                        style={{
                          width: `${calculatePercentage(
                            displayData.styleBreakdown?.kinestetik
                          )}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* summary */}
              {displayData.summary && (
                <div className="bg-gray-50 border border-gray-200/60 p-4 rounded-xl text-xs sm:text-sm 2xl:text-base text-gray-600 leading-relaxed">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-800 block">
                      Kesimpulan
                    </span>
                  </div>
                  {displayData.summary}
                </div>
              )}
            </>
          ) : (
            // State Error/Kosong
            <div className="flex flex-col items-center justify-center py-10 text-center space-y-3">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-gray-400">
                <AlertCircle size={32} />
              </div>
              <h4 className="text-lg font-semibold text-gray-800">
                Data Tidak Tersedia
              </h4>
            </div>
          )}
        </div>

        {/* footer */}
        <div className="p-4 bg-gray-50 border-t border-gray-100 flex gap-3 shrink-0">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl bg-[#3F3370] text-white font-semibold text-sm hover:bg-[#2e2555] transition-colors shadow-lg shadow-purple-900/10"
          >
            Tutup & Lanjutkan
          </button>
        </div>
      </div>
    </div>
  );
};
