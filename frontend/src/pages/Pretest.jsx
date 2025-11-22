import React from "react";
import { Filter, ArrowUpRight, ClipboardCheck, Info } from "lucide-react";
import { Link } from "react-router";

const Pretest = () => {
  return (
    <section
      className="bg-white mt-3 rounded-[30px] p-8 shadow-sm min-h-[calc(100vh-140px)] flex flex-col lg:flex-row gap-8"
      aria-label="Halaman Pretest"
    >
      <div className="flex-1 flex flex-col gap-6">
        <article className="bg-white border border-gray-100 rounded-3xl p-1 shadow-sm flex flex-col">
          <div className="p-6 flex flex-col h-full">
            {/* header */}
            <header className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Ketahui Pola Belajarmu!
              </h2>
              <p className="text-gray-500 text-sm leading-relaxed max-w-md">
                Dengan mengisi serangkaian pertanyaan untuk mendapatkan Insight
              </p>
            </header>
            {/* menus */}
            <section className="flex flex-col gap-6">
              <div aria-label="Pilihan Informasi" className="flex gap-4">
                <Link
                  to="/dashboard/info/lorem"
                  className="flex-1 border-2 border-[#A090E0]/30 bg-[#FDFDFF] rounded-2xl p-5 flex flex-col gap-3 hover:border-[#A090E0] transition-colors group"
                >
                  <div className="w-10 h-10 rounded-full border border-[#A090E0] flex items-center justify-center text-[#4A3B80]">
                    <Info size={20} aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#4A3B80] group-hover:text-[#3F3370]">
                      Lorem
                    </h3>
                    <div className="flex items-center text-[#8A8A8A] text-xs mt-1">
                      ipsum dolor{" "}
                      <span
                        className="ml-1 text-xs transition-transform group-hover:translate-x-1"
                        aria-hidden="true"
                      >
                        &gt;
                      </span>
                    </div>
                  </div>
                </Link>
                <Link
                  to="/dashboard/info/jenis-soal"
                  className="flex-1 border-2 border-[#A090E0]/30 bg-[#FDFDFF] rounded-2xl p-5 flex flex-col gap-3 hover:border-[#A090E0] transition-colors group"
                >
                  <div className="w-10 h-10 rounded-full border border-[#A090E0] flex items-center justify-center text-[#4A3B80]">
                    <Info size={20} aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#4A3B80] group-hover:text-[#3F3370]">
                      Lihat
                    </h3>
                    <div className="flex items-center text-[#8A8A8A] text-xs mt-1">
                      Jenis-jenis soal{" "}
                      <span
                        className="ml-1 text-xs transition-transform group-hover:translate-x-1"
                        aria-hidden="true"
                      >
                        &gt;
                      </span>
                    </div>
                  </div>
                </Link>
              </div>
              <footer className="mt-auto">
                <Link
                  to="/dashboard/pretest/start"
                  className="w-full bg-[#3F3370] hover:bg-[#2e2555] text-white rounded-2xl p-6 flex items-center gap-6 transition-all shadow-lg shadow-purple-900/20 group"
                >
                  <div
                    className="w-14 h-16 border-2 border-white/30 rounded-xl flex items-center justify-center ml-2"
                    aria-hidden="true"
                  >
                    <ClipboardCheck size={32} className="text-white" />
                  </div>
                  <div className="text-left py-3">
                    <span className="block text-xl font-bold mb-1">Mulai</span>
                    <span className="flex items-center text-purple-200 text-sm">
                      Mengisi Test{" "}
                      <span
                        className="ml-2 transform group-hover:translate-x-1 transition-transform"
                        aria-hidden="true"
                      >
                        &gt;
                      </span>
                    </span>
                  </div>
                </Link>
              </footer>
            </section>
          </div>
        </article>
      </div>
      {/* right side */}
      <aside
        className="w-full lg:w-[380px] flex-shrink-0"
        aria-label="Riwayat Pretest"
      >
        <div className="bg-[#4A3B80] rounded-3xl overflow-hidden border border-gray-100 shadow-sm h-full flex flex-col">
          {/* header */}
          <header className="bg-[#4A3B80] p-6 flex justify-between items-center text-white rounded-t-3xl">
            <h3 className="font-semibold text-lg">Riwayat Pretest</h3>
            <button
              aria-label="Filter Riwayat"
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg text-xs transition-colors backdrop-blur-sm border border-white/10"
            >
              filter <Filter size={12} aria-hidden="true" />
            </button>
          </header>
          {/* tests history list */}
          <div className="p-4 bg-white flex-1 overflow-y-auto max-h-[500px] rounded-t-2xl">
            <ul className="flex flex-col gap-3">
              {[1, 2, 3, 4, 5].map((item) => (
                <li key={item}>
                  <Link
                    to={`/dashboard/pretest/result/${item}`}
                    className="group flex items-center justify-between bg-[#F3F4F6] hover:bg-[#EDE8FA] p-4 rounded-2xl transition-colors"
                  >
                    <div>
                      <h4 className="font-bold text-gray-800 text-sm">
                        Date {item}
                      </h4>
                      <p className="text-xs text-gray-400 mt-1">
                        Description....
                      </p>
                    </div>
                    <div
                      className="text-gray-400 group-hover:text-[#4A3B80]"
                      aria-hidden="true"
                    >
                      <ArrowUpRight size={20} />
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </aside>
    </section>
  );
};

export default Pretest;
