import React from "react";
import { Lightbulb, Eye, Volume2, Sparkles, X, Hand } from "lucide-react";

const learningStylesInfo = [
  {
    title: "Visual Learner",
    icon: <Eye size={24} />,
    color: "bg-teal-100 text-teal-600",
    desc: "Belajar paling efektif melalui penglihatan. Menyukai diagram, peta konsep, warna, video, dan mencatat dengan rapi.",
  },
  {
    title: "Auditory Learner",
    icon: <Volume2 size={24} />,
    color: "bg-indigo-100 text-indigo-600",
    desc: "Belajar paling baik melalui pendengaran. Menyukai diskusi, mendengarkan ceramah atau rekaman, dan mengulang informasi secara verbal.",
  },
  {
    title: "Kinesthetic Learner",
    icon: <Hand size={24} />,
    color: "bg-orange-100 text-orange-600",
    desc: "Belajar melalui pengalaman fisik dan gerakan. Menyukai praktik langsung (hands-on), eksperimen, dan bergerak saat belajar (active learning).",
  },
];

export const LearningStyleModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    // overlay backdrop
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm transition-all animate-in fade-in duration-300"
      onClick={onClose}
    >
      {/* moda container */}
      <div
        className="bg-white rounded-2xl md:rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* header */}
        <div className="p-6 border-b border-gray-100 flex justify-between items-start bg-[#FDFDFF]">
          <div>
            <div className="flex items-center gap-4">
              <Sparkles size={18} className="text-primary animate-pulse" />
              <h3 className="text-2xl sm:text-2xl font-semibold text-gray-900 tracking-tight">
                Gaya Belajar
              </h3>
            </div>
            <p className="text-gray-500 mt-2 text-sm sm:text-base leading-relaxed max-w-lg">
              Setiap orang memiliki preferensi sensorik. Kenali 3 gaya utama
              untuk mengoptimalkan retensi memori.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/*body */}
        <div className="p-6 overflow-y-auto minimal-scroll">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {learningStylesInfo.map((style, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl border-2 border-gray-100 hover:ring-1 ring-primary/5 transition-all bg-white flex flex-col gap-3 shadow-none hover:shadow-sm"
              >
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center ${style.color}`}
                >
                  {style.icon}
                </div>
                <div>
                  <h4 className="text-lg font-bold text-gray-800 mb-2">
                    {style.title}
                  </h4>
                  <p className="text-sm text-gray-500 leading-relaxed text-justify">
                    {style.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* footer */}
        <div className="relative p-6 sm:p-2 bg-white border-t border-gray-100 hidden">
          <div className="relative flex flex-col sm:flex-row items-center justify-center gap-4 text-center sm:text-left bg-white/60 border border-white/60 shadow-sm rounded-2xl p-4 backdrop-blur-sm">
            <div className="p-3 bg-[#3F3370] text-white rounded-full shrink-0">
              <Lightbulb
                size={20}
                fill="currentColor"
                className="text-yellow-300"
              />
            </div>
            <div>
              <p className="text-xs font-bold text-primary uppercase tracking-wider mb-1">
                Pro Insight
              </p>
              <p className="text-sm text-gray-600 font-medium max-w-xl leading-relaxed">
                "Gaya belajar Anda bersifat{" "}
                <span className="text-gray-900 font-bold">fleksibel</span>. Ia
                dapat diasah dan disesuaikan dengan jenis materi yang
                dipelajari."
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
