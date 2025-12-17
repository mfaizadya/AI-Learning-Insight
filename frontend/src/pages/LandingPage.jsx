import Footer from "@/layouts/Footer";
import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router";

// noise texture
const NOISE_BG =
  "url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22 opacity=%220.05%22/%3E%3C/svg%3E')";

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

const Sparkles = () => (
  <svg
    className="w-5 h-5"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
  </svg>
);

const LandingPage = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  //  ref for optimize performance
  const scrollRef = useRef(0);
  const blob1Ref = useRef(null);
  const blob2Ref = useRef(null);
  const textRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);

    // optimize parallax logic
    let animationFrameId;

    const animate = () => {
      const scrollY = window.scrollY;

      if (blob1Ref.current) {
        blob1Ref.current.style.transform = `translate3d(0, ${
          scrollY * 0.15
        }px, 0)`;
      }
      if (blob2Ref.current) {
        blob2Ref.current.style.transform = `translate3d(0, -${
          scrollY * 0.1
        }px, 0)`;
      }
      if (textRef.current) {
        textRef.current.style.transform = `translate3d(-${
          scrollY * 0.2
        }px, 0, 0)`;
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    // run loop animation
    animate();

    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  const handleAuth = () =>
    isLoggedIn ? navigate("/dashboard") : navigate("/auth/register");

  return (
    <div className="relative w-full overflow-hidden bg-background text-foreground font-sans selection:bg-accent selection:text-white">
      {/* noise */}
      <div
        className="fixed inset-0 z-50 pointer-events-none opacity-40 mix-blend-overlay"
        style={{ backgroundImage: NOISE_BG }}
      ></div>

      {/* bg parallax. blob */}
      {/* <div className="fixed inset-0 z-0 w-full h-full pointer-events-none">
        <div
          ref={blob1Ref}
          className="absolute -top-[20%] -left-[10%] w-[70vw] h-[70vw] rounded-full bg-accent/20 blur-[120px] will-change-transform opacity-60 mix-blend-multiply dark:mix-blend-screen"
        />
        <div
          ref={blob2Ref}
          className="absolute top-[40%] -right-[20%] w-[60vw] h-[60vw] rounded-full bg-primary/5 blur-[100px] will-change-transform opacity-50"
        />
      </div> */}

      {/* bg */}
      <div className="fixed top-1/2 left-0 w-full -translate-y-1/2 z-0 pointer-events-none opacity-[0.03] dark:opacity-[0.05] whitespace-nowrap overflow-hidden">
        <h1
          ref={textRef}
          className="text-[20rem] font-black leading-none tracking-tighter will-change-transform"
        >
          INSIGHT INTELLIGENCE
        </h1>
      </div>

      {/* main content */}
      <div className="relative z-10">
        {/* nav */}
        <nav className="fixed top-6 left-0 right-0 z-50 px-6">
          <div className="max-w-7xl mx-auto sm:bg-background/70 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-full px-6 h-16 sm:h-20 flex items-center justify-between sm:shadow-sm">
            <span className="text-sm sm:text-xl font-semibold tracking-tight flex items-center gap-2 sm:ml-4">
              {/* <span className="w-3 h-3 rounded-full bg-primary animate-pulse"></span> */}
              <Sparkles size={20} />
              CerdasKu.
            </span>
            <div className="flex items-center gap-6 text-sm font-medium">
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
            {/* Text Area (Left - Span 7) */}
            <div className="lg:col-span-7 flex flex-col gap-8 relative">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-accent/30 bg-accent/5 w-fit">
                {/* <Sparkles /> */}
                <span className="text-xs font-bold uppercase tracking-widest text-accent-foreground">
                  AI Learning Insight
                </span>
              </div>

              <h1 className="text-6xl md:text-8xl font-bold tracking-tighter leading-[0.9]">
                Unlock your <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_auto] animate-gradient">
                  Learning DNA.
                </span>
              </h1>

              <p className="text-lg sm:text-xl text-muted-foreground max-w-xl leading-relaxed border-l-2 border-accent/50 pl-6">
                Lebih dari sekadar nilai. Kami menganalisis aktivitas,
                kecepatan, dan waktu belajar Anda untuk mengungkap{" "}
                <strong>Pola & Gaya Belajar Unik</strong> dan memberikan insight
                yang reflektif.
              </p>

              <div className="flex flex-wrap gap-4 mt-4">
                <button
                  onClick={handleAuth}
                  className="group relative px-8 py-4 bg-foreground text-background rounded-full font-semibold overflow-hidden hover:bg-primary/90 transition-all active:scale-95"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Mulai Eksplorasi <ArrowRight />
                  </span>
                  {/* <div className="absolute inset-0 bg-accent translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div> */}
                </button>
              </div>
            </div>

            {/* Visual Area (Right - Span 5) - Anti-Design "Broken" Card */}
            <div className="lg:col-span-5 relative hidden lg:block">
              {/* Abstract Code Card */}
              <div className="relative z-20 bg-card/50 backdrop-blur-md border border-white/20 p-8 rounded-3xl shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-3 h-3 rounded-full bg-destructive"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <div className="space-y-3 font-mono text-xs md:text-sm text-muted-foreground">
                  <p className="text-muted-foreground/50">
                    # AI Analysis Logic
                  </p>
                  <p>
                    <span className="text-primary">if</span> (avg_time &gt;
                    threshold <span className="text-accent">&&</span> reviews
                    &gt; 5) &#123;
                  </p>
                  <p className="pl-4">
                    pattern ={" "}
                    <span className="text-green-500">"Reflective Learner"</span>
                    ;
                  </p>
                  <p className="pl-4">
                    advice ={" "}
                    <span className="text-yellow-500">
                      "Optimize review sessions..."
                    </span>
                    ;
                  </p>
                  <p>
                    &#125; <span className="text-primary">else if</span>{" "}
                    (consistency_score &gt; 0.9) &#123;
                  </p>
                  <p className="pl-4">
                    pattern ={" "}
                    <span className="text-green-500">"Consistent Learner"</span>
                    ;
                  </p>
                  <p>&#125;</p>
                  <p className="mt-4 text-muted-foreground/50">
                    # Output to Student Dashboard
                  </p>
                  <p>
                    return <span className="text-primary">generateInsight</span>
                    (pattern);
                  </p>
                </div>

                {/* floating badge */}
                <div className="absolute -bottom-6 -left-6 bg-background border border-border px-6 py-4 rounded-2xl shadow-xl flex items-center gap-3 animate-bounce-slow">
                  <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center text-purple-600 font-bold">
                    R
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Pattern Detected
                    </p>
                    <p className="font-bold">Reflective Learner</p>
                  </div>
                </div>
              </div>

              {/* Decorative Elements behind */}
              <div className="absolute top-10 right-10 w-full h-full border-2 border-dashed border-primary/20 rounded-3xl z-10 transform -rotate-2"></div>
            </div>
          </div>
        </section>

        {/* features */}
        <section className="py-32 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-end mb-24 border-b border-border pb-8">
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight max-w-lg">
                Kenali diri, <br /> Optimalkan Potensi.
              </h2>
              <p className="text-muted-foreground mt-4 md:mt-0 max-w-xs text-right">
                Menerjemahkan hasil analisis{" "}
                <strong>Gaya & Pola Belajar</strong> menjadi insight yang
                dipersonalisasi.
              </p>
            </div>

            {/* Asymmetrical Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* card 1 */}
              <div className="group relative p-10 bg-white/50 rounded-[2rem] hover:bg-white/35 transition-colors border-dashed border-4 border-primary/15 hover:border-primary/50">
                <h3 className="text-2xl font-bold mb-4 group-hover:text-primary transition-colors">
                  Deep Profiling
                </h3>
                <p className="text-muted-foreground">
                  Analisis mendalam terhadap gaya belajar kognitif Anda
                  menggunakan machine learning.
                </p>
                <div className="mt-8 w-full h-[1px] bg-border group-hover:bg-primary transition-colors"></div>
              </div>

              {/* card 2 */}
              <div className="group relative p-10 bg-white/50 rounded-[2rem] hover:bg-white/35 transition-colors border-dashed border-4 border-primary/15 hover:border-primary/50 md:mt-16">
                <h3 className="text-2xl font-bold mb-4 group-hover:text-primary transition-colors">
                  Actionable Insight
                </h3>
                <p className="text-muted-foreground">
                  Bukan sekadar grafik data. Kami menyajikan wawasan yang mudah
                  dipahami dan relevan agar Anda tahu persis area mana yang
                  perlu diperbaiki.
                </p>
                <div className="mt-8 w-full h-[1px] bg-border group-hover:bg-primary transition-colors"></div>
              </div>

              {/* card 3 */}
              <div className="group relative p-10 bg-white/50 rounded-[2rem] hover:bg-white/35 transition-colors border-dashed border-4 border-primary/15 hover:border-primary/50 md:mt-32">
                <h3 className="text-2xl font-bold mb-4 group-hover:text-primary transition-colors">
                  Impact & Strategy
                </h3>
                <p className="text-muted-foreground">
                  Pahami diri Anda sebagai pembelajar. Adopsi strategi yang
                  dipersonalisasi untuk meningkatkan pemahaman dan efektivitas
                  belajar jangka panjang.
                </p>
                <div className="mt-8 w-full h-[1px] bg-border group-hover:bg-primary transition-colors"></div>
              </div>
            </div>
          </div>
        </section>

        {/* <footer className="py-12 border-t border-border/40 bg-background/50 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center opacity-60 hover:opacity-100 transition-opacity">
            <p className="font-mono font-bold text-xs sm:text-base">Designed for Capstone 2025</p>
            <p className="text-xs sm:text-base mt-2 md:mt-0">
              &copy; Cerdasku Intelligence System
            </p>
          </div>
        </footer> */}
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
