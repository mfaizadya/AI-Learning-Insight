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
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 max-w-[85%] sm:max-w-[360px] animate-in slide-in-from-bottom-10 fade-in duration-500">
      <div className="bg-card/95 backdrop-blur-md border border-border shadow-[0_8px_30px_rgb(0,0,0,0.12)] rounded-2xl p-4 sm:p-5 relative overflow-hidden">
        {/* bg decoration */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-full -mr-10 -mt-10 blur-2xl pointer-events-none"></div>

        <div className="relative z-10">
          {/* header */}
          <div className="flex flex-col sm:flex items-start gap-3 mb-3">
            <div className="flex w-full items-center justify-between">
              <div className="p-2 bg-primary/10 rounded-lg text-primary shrink-0">
                <Cookie size={20} />
              </div>
              <button
                onClick={handleDecline}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <X size={16} />
              </button>
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-foreground text-sm sm:text-base">
                Kami menghargai privasi Anda
              </h4>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                Kami menggunakan cookie untuk meningkatkan pengalaman belajar
                Anda, mempersonalisasi konten, dan menganalisis lalu lintas
                situs.
              </p>
            </div>
          </div>

          {/* links */}
          <div className="mb-4 text-xs text-muted-foreground">
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
          <div className="flex flex-col sm:flex-row gap-2.5">
            <button
              onClick={handleDecline}
              className="flex-1 px-3 py-2 rounded-lg border border-border text-xs sm:text-sm font-semibold text-muted-foreground hover:bg-secondary transition-all"
            >
              Tolak Semua
            </button>
            <button
              onClick={handleAccept}
              className="flex-1 px-3 py-2 rounded-lg bg-primary text-primary-foreground text-xs sm:text-sm font-semibold hover:bg-primary/90 shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all flex items-center justify-center gap-2"
            >
              <ShieldCheck size={14} />
              Terima Semua
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
