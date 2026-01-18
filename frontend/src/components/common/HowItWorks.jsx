import { Brain, FileText, Lightbulb, UserPlus } from "lucide-react";

export const HowItWorks = () => {
    const processSteps = [
        {
            icon: UserPlus,
            title: "Daftar Akun",
            desc: "Buat akun CerdasKu untuk mulai menyimpan progres belajar Anda.",
        },
        {
            icon: FileText,
            title: "Asesmen",
            desc: "Jawab serangkaian pertanyaan interaktif yang dirancang khusus.",
        },
        {
            icon: Brain,
            title: "Analisis AI",
            desc: "Sistem cerdas kami memproses pola jawaban dan perilaku Anda.",
        },
        {
            icon: Lightbulb,
            title: "Insight",
            desc: "Terima laporan gaya belajar dan rekomendasi strategi yang personal.",
        },
    ];

    return (
        <section className="py-16 sm:py-20 md:py-24 px-4 sm:px-6 md:px-8 bg-secondary/30 relative overflow-hidden">
            {/* Background decorations */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-5%] w-[25vw] h-[25vw] bg-primary/5 rounded-full blur-[60px]" />
                <div className="absolute bottom-[-10%] right-[-5%] w-[25vw] h-[25vw] bg-accent/5 rounded-full blur-[60px]" />
            </div>

            <div className="max-w-6xl mx-auto relative z-10">
                {/* Section header */}
                <div className="text-center mb-12 sm:mb-14 md:mb-16">
                    <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full border border-primary/20 bg-primary/5 w-fit mb-4 sm:mb-5">
                        <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-primary">
                            Workflow
                        </span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight mb-3 sm:mb-4">
                        Bagaimana Cara Kerjanya?
                    </h2>
                    <p className="text-muted-foreground max-w-xl mx-auto text-sm sm:text-base">
                        Proses sederhana untuk mengungkap potensi belajar Anda yang sebenarnya.
                    </p>
                </div>

                {/* Steps grid */}
                <div className="relative grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-8 sm:gap-6 md:gap-8">
                    {/* Connecting line (desktop) */}
                    <div className="hidden lg:block absolute top-7 left-[14%] right-[14%] h-0.5 border-t-2 border-dashed border-primary/20 z-0" />

                    {processSteps.map((step, index) => (
                        <div
                            key={index}
                            className="relative flex flex-col items-center text-center z-10 group"
                        >
                            {/* Icon container */}
                            <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-2xl bg-background border border-primary/20 flex items-center justify-center mb-3 sm:mb-4 md:mb-5 shadow-lg shadow-primary/5 relative group-hover:border-primary/40 transition-colors">
                                <step.icon className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-primary" />
                                {/* Step number */}
                                <div className="absolute -top-2 -right-2 sm:-top-2.5 sm:-right-2.5 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-[10px] sm:text-xs border-2 border-background shadow-sm">
                                    {index + 1}
                                </div>
                            </div>

                            <h3 className="text-sm sm:text-base md:text-lg font-bold mb-1 sm:mb-2">
                                {step.title}
                            </h3>
                            <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed max-w-[140px] sm:max-w-[160px] md:max-w-[180px]">
                                {step.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};