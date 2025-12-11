import React from "react";
import {
  Lightbulb,
  Repeat,
  Scale,
  Search,
  Sparkles,
  X,
  Zap,
} from "lucide-react";

const learningPatternsInfo = [
  {
    title: "Consistent Learner",
    icon: <Repeat size={24} />,
    color: "bg-blue-100 text-blue-600",
    desc: "Tipe pembelajar yang menjaga ritme belajar secara stabil dan rutin. Belajar dengan frekuensi tinggi, durasi moderat, dan pengulangan konsisten.",
  },
  {
    title: "Fast Learner",
    icon: <Zap size={24} />,
    color: "bg-yellow-100 text-yellow-600",
    desc: "Pembelajar yang cepat memahami materi dengan durasi singkat dan jarang melakukan pengulangan. Unggul dalam kecepatan menyelesaikan tugas.",
  },
  {
    title: "Reflective Learner",
    icon: <Search size={24} />,
    color: "bg-purple-100 text-purple-600",
    desc: "Pembelajar yang teliti dan mendalam. Cenderung menghabiskan waktu lama dan sering mengulang materi untuk pemahaman yang kuat.",
  },
  {
    title: "Balanced Learner",
    icon: <Scale size={24} />,
    color: "bg-green-100 text-green-600",
    desc: "Menyeimbangkan kecepatan dan kedalaman. Frekuensi, durasi, dan pengulangan serba moderat. Sangat fleksibel.",
  },
];

export const LearningPatternModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    // overlay backdrop
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm transition-all animate-in fade-in duration-300"
      onClick={onClose}
    >
      {/* moda container */}
      <div
        className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* header */}
        <div className="p-6 border-b border-gray-100 flex justify-between items-start bg-[#FDFDFF]">
          <div>
            <div className="flex items-center gap-4">
              <Sparkles size={18} className="text-primary animate-pulse" />
              <h3 className="text-2xl sm:text-2xl font-semibold text-gray-900 tracking-tight">
                Pola Belajar
              </h3>
            </div>
            <p className="text-gray-500 mt-2 text-sm sm:text-base leading-relaxed max-w-lg">
              Setiap orang memiliki ritme unik. Kenali 4 arketipe utama cara
              otak memproses informasi baru.
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
            {learningPatternsInfo.map((pattern, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl border-2 border-gray-100 hover:ring-1 ring-primary/5 transition-all bg-white flex flex-col gap-3 shadow-none hover:shadow-sm"
              >
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center ${pattern.color}`}
                >
                  {pattern.icon}
                </div>
                <div>
                  <h4 className="text-lg font-bold text-gray-800 mb-2">
                    {pattern.title}
                  </h4>
                  <p className="text-sm text-gray-500 leading-relaxed text-justify">
                    {pattern.desc}
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
                "Pola belajar Anda bersifat{" "}
                <span className="text-gray-900 font-bold">dinamis</span>. Ia
                dapat berevolusi seiring tingkat kesulitan materi dan kondisi
                mental Anda."
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
