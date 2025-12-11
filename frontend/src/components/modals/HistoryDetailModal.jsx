import React from "react";
import {
  X,
  CalendarDays,
  CheckCircle2,
  AlertCircle,
  Clock,
  BarChart3,
  BrainCircuit,
  Eye,
  Ear,
  Hand,
  Repeat,
  Zap,
  Search,
  Scale,
} from "lucide-react";

export const HistoryDetailModal = ({ isOpen, data, onClose, isClosing }) => {
  if (!isOpen || !data) return null;

  // helper patterns
  const getPatternIcon = (type) => {
    if (!type) return <Scale size={20} />;
    if (type.includes("Consistent")) return <Repeat size={20} />;
    if (type.includes("Fast")) return <Zap size={20} />;
    if (type.includes("Reflective")) return <Search size={20} />;
    return <Scale size={20} />;
  };

  const getPercentage = (val) => Math.round((val / 6) * 100);

  return (
    <div
      onClick={onClose}
      className={`
        fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm 
        transition-all duration-300 ease-in-out
        ${isClosing ? "opacity-0 pointer-events-none" : "opacity-100"} 
        ${/* ... */ ""}
      `}
    >
      {/* body */}
      <div
        onClick={(e) => e.stopPropagation()}
        className={`
          bg-white rounded-[1.2rem] shadow-2xl w-full max-w-lg overflow-hidden flex flex-col 
          transform transition-all duration-300 ease-in-out
          ${
            isClosing
              ? "scale-95 translate-y-4 opacity-0"
              : "scale-100 translate-y-0 opacity-100"
          }
        `}
      >
        {/* header */}
        <div className="relative bg-[#3F3370] p-6 text-white overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 blur-2xl"></div>
          <div className="relative z-10 flex justify-between items-start">
            <div>
              <h3 className="text-xl font-semibold">Laporan Hasil Tes</h3>
              <p className="text-purple-200 text-xs mt-1 flex items-center gap-1.5 opacity-90">
                <CalendarDays size={12} /> {data.date} • {data.duration}
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
          {data.status === "Selesai" ? (
            <>
              {/* result */}
              <div className="bg-[#FDFDFF] border border-gray-100 p-5 rounded-2xl shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 p-3 opacity-5">
                  <BrainCircuit size={80} />
                </div>
                <p className="text-xs text-primary font-semibold mb-3 flex items-center gap-2">
                  {/* <span className="w-1.5 h-1.5 rounded-full bg-primary"></span> */}
                  Pola Belajar (9 Soal)
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-9 h-9 sm:w-14 sm:h-14 rounded-full bg-purple-50 text-primary flex items-center justify-center border border-purple-100">
                    {getPatternIcon(data.patternResult)}
                  </div>
                  <div>
                    <h4 className="text-lg sm:text-xl font-bold text-gray-800">
                      {data.patternResult}
                    </h4>
                    <p className="text-xs text-gray-500 mt-1">
                      Karakteristik utama proses belajar Anda.
                    </p>
                  </div>
                </div>
              </div>

              {/* learn style result */}
              <div className="space-y-4 px-1">
                <p className="text-xs text-gray-400 font-semibold flex items-center gap-2 px-0">
                  {/* <span className="w-1.5 h-1.5 rounded-full bg-gray-300"></span> */}
                  Gaya Belajar (6 Soal)
                </p>

                <div className="space-y-3 bg-white">
                  {/* visual */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-medium">
                      <span className="flex items-center gap-2 text-gray-700">
                        <Eye size={14} className="text-blue-500" /> Visual
                      </span>
                      <span className="text-gray-900">
                        {getPercentage(data.styleBreakdown.visual)}%
                      </span>
                    </div>
                    <div className="h-2.5 w-full bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500 rounded-full"
                        style={{
                          width: `${getPercentage(
                            data.styleBreakdown.visual
                          )}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                  {/* auditory */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-medium">
                      <span className="flex items-center gap-2 text-gray-700">
                        <Ear size={14} className="text-pink-500" /> Auditory
                      </span>
                      <span className="text-gray-900">
                        {getPercentage(data.styleBreakdown.auditory)}%
                      </span>
                    </div>
                    <div className="h-2.5 w-full bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-pink-500 rounded-full"
                        style={{
                          width: `${getPercentage(
                            data.styleBreakdown.auditory
                          )}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                  {/* kinesthetic */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-medium">
                      <span className="flex items-center gap-2 text-gray-700">
                        <Hand size={14} className="text-orange-500" />{" "}
                        Kinesthetic
                      </span>
                      <span className="text-gray-900">
                        {getPercentage(data.styleBreakdown.kinesthetic)}%
                      </span>
                    </div>
                    <div className="h-2.5 w-full bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-orange-500 rounded-full"
                        style={{
                          width: `${getPercentage(
                            data.styleBreakdown.kinesthetic
                          )}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* AI Insight */}
              <div className="bg-gray-50 border border-gray-200/60 p-4 rounded-xl text-sm text-gray-600 leading-relaxed">
                <span className="font-semibold text-gray-800 block mb-1">
                  💡 AI Insight:
                </span>
                {data.summary}
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-10 text-center space-y-3">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-gray-400">
                <AlertCircle size={32} />
              </div>
              <h4 className="text-lg font-semibold text-gray-800">
                Tes Belum Diselesaikan
              </h4>
              <p className="text-sm text-gray-500 max-w-xs">
                Data pola dan gaya belajar belum tersedia. Silakan selesaikan
                tes ini.
              </p>
            </div>
          )}
        </div>

        {/* footer */}
        <div className="p-4 bg-gray-50 border-t border-gray-100 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-600 font-semibold text-sm hover:bg-white transition-colors"
          >
            Tutup
          </button>
          {data.status === "Draft" && (
            <button className="flex-1 py-3 rounded-xl bg-primary text-white font-semibold text-sm hover:bg-[#2e2555] transition-colors shadow-lg shadow-purple-900/10">
              Lanjutkan Tes
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
