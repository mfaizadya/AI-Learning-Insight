import React, { useState, useEffect } from "react";
import { Cookie, X, ShieldCheck } from "lucide-react";
import { Link } from "react-router";

export const CookieConsent = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // checking
    const consent = localStorage.getItem("cookieConsent");
    if (!consent) {
      // delay time
      const timer = setTimeout(() => setIsVisible(true), 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookieConsent", "accepted");
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem("cookieConsent", "declined");
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 max-w-[90%] sm:max-w-[400px] animate-in slide-in-from-bottom-10 fade-in duration-500">
      <div className="bg-white/95 backdrop-blur-md border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.12)] rounded-3xl p-5 sm:p-6 relative overflow-hidden">
        {/* bg decoration */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-purple-50 rounded-full -mr-10 -mt-10 blur-2xl pointer-events-none"></div>

        <div className="relative z-10">
          {/* header */}
          <div className="flex flex-col sm:flex items-start gap-3 mb-3">
            <div className="flex w-full items-center justify-between">
              <div className="p-2.5 bg-[#EEF2FF] rounded-xl text-primary shrink-0">
                <Cookie size={24} />
              </div>
              <button
                onClick={handleDecline}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={18} />
              </button>
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-gray-900 text-base">
                Kami menghargai privasi Anda
              </h4>
              <p className="text-xs sm:text-sm text-gray-500 mt-1 leading-relaxed">
                Kami menggunakan cookie untuk meningkatkan pengalaman belajar
                Anda, mempersonalisasi konten, dan menganalisis lalu lintas
                situs.
              </p>
            </div>
          </div>

          {/* links */}
          <div className="mb-5 text-xs text-gray-400">
            Baca selengkapnya di{" "}
            <Link
              to="/privacy-policy"
              className="text-primary font-medium hover:underline"
            >
              Kebijakan Privasi
            </Link>{" "}
            kami.
          </div>

          {/* action */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleDecline}
              className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-all"
            >
              Tolak Semua
            </button>
            <button
              onClick={handleAccept}
              className="flex-1 px-4 py-2.5 rounded-xl bg-[#3F3370] text-white text-sm font-semibold hover:bg-[#2e2555] shadow-lg shadow-purple-900/20 hover:shadow-purple-900/30 transition-all flex items-center justify-center gap-2"
            >
              <ShieldCheck size={16} />
              Terima Semua
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
