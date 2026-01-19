import { CookieConsent } from "@/components/common/CookieConsent";
import Footer from "@/layouts/Footer";
import {
  BrainCircuit,
  Sparkles,
  Lightbulb,
  Code2,
  CheckCircle2,
  Server
} from "lucide-react";
import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router";
import { Faqs } from "@/components/common/Faqs";
import { HowItWorks } from "@/components/common/HowItWorks";

// lucide icons
const ArrowRight = () => (
  <svg
    className="w-4 h-4"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M5 12h14M12 5l7 7-7 7" />
  </svg>
);

const LandingPage = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  //  ref for optimize performance
  // const scrollRef = useRef(0);
  // const blob1Ref = useRef(null);
  // const blob2Ref = useRef(null);
  const textRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);

    // optimize parallax logic
    let animationFrameId;

    const animate = () => {
      const scrollY = window.scrollY;
      if (textRef.current) {
        textRef.current.style.transform = `translate3d(-${scrollY * 0.2
          }px, 0, 0)`;
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    // run loop animation
    animate();

    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  const handleAuth = () => {
    if (isLoggedIn) {
      window.location.href = "/dashboard";
    } else {
      navigate("/auth/register");
    }
  };

  return (
    <div className="relative w-full overflow-hidden bg-background text-foreground font-sans">
      {/* bg */}
      <div className="fixed top-1/2 left-0 w-full -translate-y-1/2 z-0 pointer-events-none opacity-[0.03] dark:opacity-[0.05] whitespace-nowrap overflow-hidden">
        <h1
          ref={textRef}
          className="text-[20rem] font-black leading-none tracking-tighter will-change-transform"
        >
          MAAS PLATFORM
        </h1>
      </div>

      {/* main content */}
      <div className="relative z-10">
        {/* nav */}
        <nav className="fixed top-6 left-0 right-0 z-50 px-6">
          <div className="max-w-7xl mx-auto sm:bg-background/70 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-full px-6 h-16 sm:h-20 md:h-[5.3rem] flex items-center justify-between sm:shadow-sm">
            <span className="text-base sm:text-xl font-semibold tracking-tight flex items-center gap-2 sm:ml-4">
              {/* <span className="w-3 h-3 rounded-full bg-primary animate-pulse"></span> */}
              <Sparkles size={20} />
              CerdasKu.
            </span>
            <div className="flex items-center gap-6 text-sm md:text-base font-medium">
              <Link
                to="/docs"
                className="hidden md:block hover:text-primary transition-colors"
              >
                API Docs
              </Link>
              {!isLoggedIn && (
                <Link
                  to="/auth/login"
                  className="hidden md:block hover:text-primary transition-colors"
                >
                  Masuk Akun
                </Link>
              )}
              <button
                onClick={handleAuth}
                className="bg-primary text-primary-foreground px-6 py-2.5 rounded-full hover:bg-primary/90 transition-all active:scale-95 max-sm:hidden"
              >
                {isLoggedIn ? "Dashboard" : "Get Started"}
              </button>
            </div>
          </div>
        </nav>

        {/* HERO SECTION - Asymmetrical Layout */}
        <section className="min-h-screen flex flex-col justify-center px-6 pt-32 pb-20">
          <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 flex flex-col gap-8 relative">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-accent/30 bg-accent/5 w-fit">
                <span className="text-xs font-bold uppercase tracking-widest text-accent-foreground">
                  AI Learning Insight
                </span>
              </div>

              <h1 className="text-6xl md:text-8xl font-semibold tracking-tighter leading-[0.9]">
                Unlock your <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_auto] animate-gradient">
                  Learning DNA.
                </span>
              </h1>

              <p className="text-[1.07rem] sm:text-xl text-muted-foreground max-w-xl leading-relaxed border-l-2 border-accent/50 pl-6">
                <strong>Metacognition-as-a-Service (MaaS)</strong> yang mengungkap gaya belajar siswa,
                sekaligus memberdayakan <strong>LMS & Institusi Pendidikan</strong> melalui API kecerdasan kognitif.
              </p>

              <div className="flex flex-wrap gap-4 mt-4">
                <button
                  onClick={handleAuth}
                  className="group relative px-8 py-4 bg-gradient-to-b from-primary to-primary/90 text-background rounded-full font-semibold overflow-hidden hover:bg-primary/90 transition-all active:scale-95"
                >
                  <span className="relative z-10 flex items-center gap-2 md:text-lg">
                    Mulai Eksplorasi <ArrowRight />
                  </span>
                </button>
                <Link
                  to="/docs"
                  className="px-8 py-4 bg-white/50 backdrop-blur-sm text-foreground rounded-full font-semibold hover:bg-white/80 transition-all border border-primary/20 flex items-center gap-2"
                >
                  <Code2 size={18} className="text-primary" />
                  Integration Docs
                </Link>
              </div>
            </div>

            {/* cards / code mockup component */}
            <div className="lg:col-span-5 relative hidden lg:block">
              {/* Glassmorphic API Card (Reverted Style with New Content) */}
              <div className="relative z-20 bg-card/50 backdrop-blur-md border border-white/20 p-8 rounded-3xl shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500">

                {/* Window Controls */}
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-3 h-3 rounded-full bg-primary/80"></div>
                  <div className="w-3 h-3 rounded-full bg-primary/50"></div>
                  <div className="w-3 h-3 rounded-full bg-primary/20"></div>
                  <span className="ml-auto text-xs font-mono text-muted-foreground/50">api/v1/predict</span>
                </div>

                {/* API Content Structured Like Code */}
                <div className="space-y-3 font-mono text-xs md:text-sm text-muted-foreground">
                  <p className="text-muted-foreground/50">
                    # Integrate Intelligence into your LMS
                  </p>
                  <p>
                    <span className="text-primary">POST</span> /predict
                  </p>

                  <p className="pl-0 text-foreground/80">
                    Headers: <span className="text-accent">{'{'}</span>
                  </p>
                  <p className="pl-4">
                    "Authorization": <span className="text-primary">"Bearer ck_live_..."</span>
                  </p>
                  <p className="text-accent">{'}'}</p>

                  <p className="pl-0 text-foreground/80 mt-2">
                    Body: <span className="text-accent">{'{'}</span>
                  </p>
                  <p className="pl-4">
                    "student_id": <span className="text-green-600 dark:text-green-400">"STU-2024"</span>,
                  </p>
                  <p className="pl-4">
                    "features": [<span className="text-primary">0.85</span>, <span className="text-primary">0.92</span>, ...]
                  </p>
                  <p className="text-accent">{'}'}</p>

                  <p className="mt-4 text-muted-foreground/50">
                    # Response (Realtime)
                  </p>
                  <p>
                    return <span className="text-primary">Insight</span>
                    (<span className="text-green-600 dark:text-green-400">"Reflective Learner"</span>);
                  </p>
                </div>

                {/* floating badge */}
                <div className="absolute -bottom-6 -left-6 bg-background border border-border px-6 py-4 rounded-2xl shadow-xl flex items-center gap-3 animate-bounce-slow">
                  <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center text-purple-600 font-bold">
                    <CheckCircle2 size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Status
                    </p>
                    <p className="font-bold text-primary">200 OK</p>
                  </div>
                </div>
              </div>

              {/* Decorative Elements behind */}
              <div className="absolute top-10 right-10 w-full h-full border-2 border-dashed border-primary/20 rounded-3xl z-10 transform -rotate-2"></div>
            </div>
          </div>
        </section>

        <section className="py-32 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-end mb-24 border-b border-border pb-8">
              <div className="self-start md:self-auto">
                <h2 className="text-4xl md:text-5xl font-semibold tracking-tight max-w-lg">
                  Kenali diri, <br /> Optimalkan Potensi.
                </h2>
              </div>
              <div className="self-end md:self-auto">
                <p className="text-muted-foreground mt-4 md:mt-0 max-w-xs lg:max-w-sm text-right xl:text-lg">
                  Menerjemahkan hasil analisis{" "}
                  <strong>Gaya & Pola Belajar</strong> menjadi insight yang
                  dipersonalisasi.
                </p>
              </div>
            </div>

            {/* Asymmetrical Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
              {/* CARD 1 */}
              <div className="group relative p-8 sm:p-10 bg-white/70 backdrop-blur-sm rounded-[2rem] border border-dashed border-primary/20 hover:border-primary transition-all duration-500 hover:shadow-[0_0_30px_-10px_rgba(var(--primary),0.3)] overflow-hidden">
                {/* Background Number Decoration */}
                <div className="absolute -right-4 -top-4 text-[15rem] font-black text-primary/5 select-none pointer-events-none transition-transform duration-500 group-hover:scale-110 group-hover:text-primary/10">
                  *
                </div>

                <div className="relative z-10">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                    <Server />
                  </div>
                  <h3 className="text-2xl font-bold mb-3 tracking-tight">
                    API-First Infrastructure
                  </h3>
                  <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                    Integrasikan kecerdasan metakognitif ke dalam LMS atau platform edukasi Anda dengan satu REST API call.
                  </p>
                </div>
              </div>

              {/* CARD 2 - Offset Top on Desktop */}
              <div className="group relative p-8 sm:p-10 bg-white/70 backdrop-blur-sm rounded-[2rem] border border-dashed border-primary/20 hover:border-primary transition-all duration-500 hover:shadow-[0_0_30px_-10px_rgba(var(--primary),0.3)] overflow-hidden md:mt-16">
                {/* Background Number Decoration */}
                <div className="absolute -right-4 -top-4 text-[15rem] font-black text-primary/5 select-none pointer-events-none transition-transform duration-500 group-hover:scale-110 group-hover:text-primary/10">
                  @
                </div>

                <div className="relative z-10">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                    <BrainCircuit />
                  </div>
                  <h3 className="text-2xl font-bold mb-3 tracking-tight">
                    Deep Profiling
                  </h3>
                  <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                    Analisis mendalam terhadap gaya belajar kognitif user
                    menggunakan machine learning & pattern recognition.
                  </p>
                </div>
              </div>

              {/* CARD 3 - Offset More on Desktop */}
              <div className="group relative p-8 sm:p-10 bg-white/70 backdrop-blur-sm rounded-[2rem] border border-dashed border-primary/20 hover:border-primary transition-all duration-500 hover:shadow-[0_0_30px_-10px_rgba(var(--primary),0.3)] overflow-hidden md:mt-32">
                {/* Background Number Decoration */}
                <div className="absolute -right-4 -top-4 text-[15rem] font-black text-primary/5 select-none pointer-events-none transition-transform duration-500 group-hover:scale-110 group-hover:text-primary/10">
                  #
                </div>

                <div className="relative z-10">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                    <svg
                      className="w-6 h-6"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                      <path d="M22 4 12 14.01l-3-3" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold mb-3 tracking-tight">
                    Impact & Strategy
                  </h3>
                  <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                    Pahami diri Anda sebagai pembelajar. Adopsi strategi yang
                    dipersonalisasi untuk meningkatkan pemahaman dan efektivitas
                    belajar jangka panjang.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* how it works section */}
        <HowItWorks />

        {/* FAQ SECTION */}
        <Faqs />
        <CookieConsent />
        <Footer />
      </div>

      {/* custom anim style */}
      <style>{`
            @keyframes gradient {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
            }
            .animate-gradient {
            animation: gradient 6s ease infinite;
            }
            .animate-bounce-slow {
            animation: bounce 3s infinite;
            }
        `}</style>
    </div>
  );
};

export default LandingPage;
