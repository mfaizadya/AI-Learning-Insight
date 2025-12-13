import { ArrowUpRight, CalendarDays, History } from "lucide-react";

export const TestHistory = ({ onSelectHistory }) => {
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

  const handleItemClick = (item) => {
    if (onSelectHistory) {
      onSelectHistory(item);
    } else {
      console.log("Item clicked:", item);
    }
  };

  return (
    <>
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
                  onClick={() => handleItemClick(item)}
                  className="group relative flex items-center justify-between bg-white border border-gray-100 hover:border-primary/30 hover:bg-purple-50/40 p-4 rounded-2xl transition-all duration-300 shadow-sm  cursor-pointer"
                >
                  {/* <div
                      className={`absolute left-0 top-3 bottom-3 w-1 rounded-r-full transition-colors duration-300 ${
                        item.status === "Selesai"
                          ? "bg-green-400/80 group-hover:bg-green-500"
                          : "bg-gray-300/80 group-hover:bg-gray-400"
                      }`}
                    ></div> */}
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
    </>
  );
};
