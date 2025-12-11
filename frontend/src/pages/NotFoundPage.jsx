import React from "react";
import { Link, useNavigate } from "react-router";
import { MoveLeft, Home, FileQuestion, LifeBuoy } from "lucide-react";

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <main className="h-dvh sm:min-h-screen w-full bg-[#FDFDFF] flex items-center justify-center relative overflow-hidden font-sans">
      {/* blobs */}
      <div className="absolute -top-20 -left-20 w-96 h-96 bg-[#EDE8FA] rounded-full blur-3xl opacity-60 pointer-events-none animate-pulse"></div>
      <div className="absolute -bottom-32 -right-20 w-[30rem] h-[30rem] bg-[#F3E8FF] rounded-full blur-3xl opacity-60 pointer-events-none"></div>
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>

      {/* main content card */}
      <div className="relative z-10 max-w-2xl w-full px-6 text-center">
        {/* icon */}
        <div className="mb-8 relative inline-block">
          <div className="w-24 h-24 sm:w-28 sm:h-28 bg-white rounded-[2rem] shadow-xl shadow-purple-900/5 flex items-center justify-center mx-auto border border-white relative z-10">
            <FileQuestion
              className="w-10 h-10 sm:w-14 sm:h-14 text-primary"
              strokeWidth={1.5}
            />
          </div>
          {/*  */}
          <div className="absolute inset-0 bg-primary rounded-[2rem] transform rotate-6 translate-x-2 translate-y-2 opacity-10 z-0"></div>
        </div>

        {/* typography */}
        <div className="space-y-4 mb-10 animate-in slide-in-from-bottom-5 fade-in duration-700">
          <h1 className="text-5xl sm:text-[5.5rem] font-extrabold text-primary tracking-tight leading-none">
            404
          </h1>
          <h2 className="text-xl sm:text-2xl font-bold text-primary">
            Halaman Tidak Ditemukan
          </h2>
          <p className="text-gray-500 text-sm sm:text-base max-w-md mx-auto leading-relaxed">
            Maaf, kami tidak dapat menemukan halaman yang Anda cari. Mungkin
            halaman tersebut sudah dipindahkan atau tautan yang Anda tuju salah.
          </p>
        </div>

        {/* btns */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in slide-in-from-bottom-10 fade-in duration-1000 fill-mode-backwards delay-150">
          <button
            onClick={() => navigate(-1)}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl border border-gray-200 bg-white text-gray-700 font-semibold hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm active:scale-95"
          >
            <MoveLeft size={18} />
            Kembali
          </button>

          <Link
            to="/dashboard"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-primary text-white font-semibold hover:bg-[#2e2555] shadow-lg shadow-purple-900/20 hover:shadow-purple-900/30 transition-all active:scale-95"
          >
            <Home size={18} />
            Ke Dashboard
          </Link>
        </div>

        {/* footer */}
        <div className="mt-12 pt-8 border-t border-gray-100 flex items-center justify-center gap-6 text-xs sm:text-sm text-gray-400">
          {/* <Link
            to="#"
            className="hover:text-primary transition-colors flex items-center gap-2"
          >
            <LifeBuoy size={14} /> Pusat Bantuan
          </Link> */}
          {/* <span>•</span> */}
          <span className="opacity-70">Error Code: PRE-404</span>
        </div>
      </div>
    </main>
  );
};

export default NotFoundPage;
