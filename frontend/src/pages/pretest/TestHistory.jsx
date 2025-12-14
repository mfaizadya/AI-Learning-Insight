import { ArrowUpRight, CalendarDays, History } from "lucide-react";

export const TestHistory = ({ onSelectHistory, historyData, isLoading }) => {
  const handleItemClick = (item) => {
    if (onSelectHistory && item.id) {
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
          {/* */}
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
          </header>
          {/* lists */}
          <div className="flex-1 bg-[#FDFDFF] relative">
            <div className="absolute inset-0 overflow-y-auto minimal-scroll p-4 px-5 sm:p-5 space-y-3">
              {isLoading && (
                <div className="text-center py-10 text-gray-500">
                  Memuat riwayat...
                </div>
              )}

              {!isLoading && historyData.length === 0 && (
                <div className="text-center py-10 text-gray-500">
                  Belum ada hasil tes yang lengkap.
                </div>
              )}

              {!isLoading &&
                historyData.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleItemClick(item)}
                    className="group relative flex items-center justify-between bg-white border border-gray-100 hover:border-primary/30 hover:bg-purple-50/40 p-4 rounded-2xl transition-all duration-300 shadow-sm  cursor-pointer"
                  >
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
                        className={`font-bold text-sm truncate pr-2 transition-colors duration-300 text-primary group-hover:text-[#2e2555]`}
                      >
                        {item.title || "Pola Belajar Tidak Ditemukan"}
                      </h4>
                      <div className="flex items-center gap-2 mt-0.5">
                        {/* Badge Style */}
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#EDE8FA] text-primary border border-primary/10 group-hover:border-primary/30 transition-colors duration-300">
                          {item.subtitle || "Gaya Belajar Tidak Ditemukan"} •{" "}
                          {item.score || 0}%
                        </span>
                      </div>
                    </div>
                    <div className="hidden lg:flex w-fit rounded-full p-1 items-center justify-center bg-gray-50 text-gray-300 border border-gray-100 transition-colors duration-300">
                      <ArrowUpRight size={16} />
                    </div>
                  </div>
                ))}
              <div className="pt-4 pb-2 text-center">
                <p className="text-[10px] font-medium text-gray-300 uppercase tracking-widest">
                  Tests History
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
