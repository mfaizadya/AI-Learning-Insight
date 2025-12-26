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
        <>
            <section className="py-24 px-6 bg-secondary/30 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                    <div className="absolute top-[-10%] left-[-5%] w-[30vw] h-[30vw] bg-primary/5 rounded-full blur-[80px]" />
                    <div className="absolute bottom-[-10%] right-[-5%] w-[30vw] h-[30vw] bg-accent/5 rounded-full blur-[80px]" />
                </div>

                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="text-center mb-20">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 w-fit mb-6">
                            <span className="text-xs font-bold uppercase tracking-widest text-primary">
                                Workflow
                            </span>
                        </div>
                        <h2 className="text-3xl md:text-5xl font-semibold tracking-tight mb-6">
                            Bagaimana Cara Kerjanya?
                        </h2>
                        <p className="text-muted-foreground max-w-2xl mx-auto text-base sm:text-lg">
                            Proses sederhana untuk mengungkap potensi belajar Anda yang
                            sebenarnya.
                        </p>
                    </div>

                    <div className="relative grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-12 md:gap-8">
                        {/* Connecting Line (Desktop) */}
                        <div className="hidden md:block absolute top-8 left-[12%] right-[12%] h-0.5 border-t-2 border-dashed border-primary/20 z-0" />

                        {processSteps.map((step, index) => (
                            <div
                                key={index}
                                className="relative flex flex-col items-center text-center z-10 group"
                            >
                                <div className="w-16 h-16 md:w-20 md:h-20 rounded-3xl bg-background border border-primary/20 flex items-center justify-center mb-4 md:mb-8 shadow-lg shadow-primary/5 relative">
                                    <step.icon className="w-6 h-6 md:w-8 md:h-8 text-primary transition-colors" />
                                    <div className="absolute -top-3 -right-3 w-6 h-6 md:w-8 md:h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-xs md:text-sm border-2 border-background shadow-sm">
                                        {index + 1}
                                    </div>
                                </div>
                                <h3 className="text-lg md:text-xl font-bold mb-2 md:mb-3">
                                    {step.title}
                                </h3>
                                <p className="text-muted-foreground text-xs md:text-sm leading-relaxed max-w-[160px] md:max-w-[220px]">
                                    {step.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </>
    )
}