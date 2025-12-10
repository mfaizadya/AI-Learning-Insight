import React from "react";
import {
  Filter,
  ArrowUpRight,
  ClipboardCheck,
  Info,
  ChevronLast,
} from "lucide-react";
import { Link } from "react-router";
import ContentDrawer from "@/components/reusable/ContentDrawer";
import { Separator } from "@/components/ui/separator";

const Pretest = () => {
  return (
    <ContentDrawer>
      {/* content / left side*/}
      <section className="flex-1 flex flex-col justify-center gap-6 my-0 py-0">
        <article className="bg-white rounded-3xl p-1 flex flex-col">
          <div className="p-5 px-4 sm:p-6 flex flex-col h-full">
            {/* header */}
            <header className="mb-8">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                Ketahui Pola Belajarmu!
              </h2>
              <p className="text-gray-500 text-sm sm:text-base leading-relaxed">
                Isi serangkaian pertanyaan-pertanyaan yang kami sediakan untuk
                membantu anda mendapatkan Insight Gaya belajar anda secara
                tepat!
              </p>
            </header>
            {/* menus */}
            <div className="flex flex-col gap-5 sm:gap-6">
              <div
                aria-label="Pilihan Informasi"
                className="flex gap-5 sm:gap-6"
              >
                {/*  */}
                <Link
                  to="/dashboard/info/lorem"
                  className="flex-1 border-2 border-[#A090E0]/30 bg-[#FDFDFF] rounded-2xl p-5 flex flex-col gap-3 hover:border-[#A090E0] transition-colors group"
                >
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-[#A090E0] flex items-center justify-center text-primary">
                    <Info
                      className="h-4 w-4 sm:w-5 sm:h-5"
                      aria-hidden="true"
                    />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg sm:text-xl text-primary group-hover:text-[#3F3370]">
                      Info
                    </h3>
                    <div className="flex items-center text-[#8A8A8A] text-sm sm:text-base sm:mt-1">
                      ipsum dolor{" "}
                      <span
                        className="ml-1 text-xs transition-transform group-hover:translate-x-1"
                        aria-hidden="true"
                      ></span>
                    </div>
                  </div>
                </Link>
                {/*  */}
                <Link
                  to="/dashboard/info/jenis-soal"
                  className="flex-1 border-2 border-[#A090E0]/30 bg-[#FDFDFF] rounded-2xl p-5 flex flex-col gap-3 hover:border-[#A090E0] transition-colors group"
                >
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-[#A090E0] flex items-center justify-center text-primary">
                    <Info
                      className="h-4 w-4 sm:w-5 sm:h-5"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="">
                    <h3 className="font-bold text-lg sm:text-xl text-primary group-hover:text-[#3F3370]">
                      Info
                    </h3>
                    <div className="flex items-center text-[#8A8A8A] text-sm sm:text-base sm:mt-1">
                      Jenis soal
                      <span
                        className="ml-1 text-xs transition-transform group-hover:translate-x-1"
                        aria-hidden="true"
                      ></span>
                    </div>
                  </div>
                </Link>
                {/*  */}
              </div>
              {/* start quiz btn */}
              <div className="mt-auto">
                <Link
                  to="/dashboard/pretest/start-quiz"
                  className="w-full bg-primary hover:bg-[#2e2555] text-white rounded-2xl p-7 flex items-center gap-6 transition-all shadow-lg shadow-purple-900/20 group"
                >
                  <div
                    className="w-14 h-16 border-2 border-white/30 rounded-xl flex items-center justify-center ml-2"
                    aria-hidden="true"
                  >
                    <ClipboardCheck size={32} className="text-white" />
                  </div>
                  <div className="text-left sm:py-4">
                    <span className="block text-lg sm:text-xl font-bold sm:mb-1">Mulai</span>
                    <span className="flex items-center text-purple-200 text-sm">
                      Mengisi Test{" "}
                      <span
                        className="ml-2 transform group-hover:translate-x-1 transition-transform"
                        aria-hidden="true"
                      >
                        <ChevronLast size={17} className="mt-[0.2rem]" />
                      </span>
                    </span>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </article>
      </section>
      {/*  */}
      <Separator className="sm:hidden w-[80%] px-8 mx-auto" />
      {/* right side */}
      {/* pretest history */}
      <section
        className="w-full lg:w-[380px] flex-shrink-0 justify-center py-5 px-4 sm:px-0"
        aria-label="Riwayat Pretest"
      >
        <div className="bg-transparent rounded-2xl overflow-hidden shadow-sm h-full flex flex-col max-h-[30.35rem]">
          {/* header */}
          <header className="p-6 flex justify-between items-center bg-primary text-primary rounded-2xl px-9 text-white">
            <h3 className="font-semibold text-lg">Riwayat Pretest</h3>
            <button
              aria-label="Filter Riwayat"
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg text-xs transition-colors backdrop-blur-sm border border-white/10"
            >
              filter <Filter size={12} aria-hidden="true" />
            </button>
          </header>
          {/* tests history list */}
          <div className="minimal-scroll p-6 sm:p-6 md:p-5 bg-white flex-1 overflow-y-auto max-h-[27rem] rounded-t-[1.2rem] rounded-b-none">
            <ul className="flex flex-col gap-3">
              {[1, 2, 3, 4, 5, 6, 7].map((item) => (
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
                      className="text-gray-400 group-hover:text-primary"
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
      </section>
    </ContentDrawer>
  );
};

export default Pretest;
