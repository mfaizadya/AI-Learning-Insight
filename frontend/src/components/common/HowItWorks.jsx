import { Brain, FileText, Lightbulb, UserPlus, Key, Code2, Server } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

export const HowItWorks = () => {
    const studentSteps = [
        {
            icon: UserPlus,
            title: "Daftar Akun",
            desc: "Buat akun CerdasKu untuk mulai menyimpan progres belajar Anda.",
        },
        {
            icon: FileText,
            title: "Asesmen",
            desc: "Jawab serangkaian pertanyaan kognitif yang dirancang khusus.",
        },
        {
            icon: Brain,
            title: "Analisis AI",
            desc: "Engine kami memproses pola jawaban untuk memetakan DNA belajar.",
        },
        {
            icon: Lightbulb,
            title: "Insight",
            desc: "Terima laporan gaya belajar dan rekomendasi strategi personal.",
        },
    ];

    const devSteps = [
        {
            icon: UserPlus,
            title: "Partner Account",
            desc: "Daftar sebagai Institusi/LMS dan akses dashboard integrasi.",
        },
        {
            icon: Key,
            title: "Generate Key",
            desc: "Dapatkan API Key (Live/Sandbox) untuk autentikasi sistem sekolah Anda.",
        },
        {
            icon: Code2,
            title: "Connect LMS",
            desc: "Hubungkan data aktivitas siswa dari LMS Anda ke endpoint kami.",
        },
        {
            icon: Server,
            title: "Receive Pattern",
            desc: "Terima hasil analisis metakognitif siswa secara realtime.",
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
                <div className="text-center mb-10 sm:mb-14">
                    <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full border border-primary/20 bg-primary/5 w-fit mb-4">
                        <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-primary">
                            Workflow
                        </span>
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight mb-4">
                        Cara Kerja Sistem
                    </h2>
                    <p className="text-muted-foreground max-w-xl mx-auto text-sm sm:text-base mb-8">
                        Pilih alur yang sesuai dengan peran Anda.
                    </p>
                </div>

                <Tabs defaultValue="student" className="w-full">
                    <div className="flex justify-center mb-12">
                        <TabsList className="grid w-full max-w-xs grid-cols-2 bg-background/50 backdrop-blur-sm border border-border/50">
                            <TabsTrigger value="student">Student Flow</TabsTrigger>
                            <TabsTrigger value="developer">Partner / LMS</TabsTrigger>
                        </TabsList>
                    </div>

                    <TabsContent value="student">
                        <StepsGrid steps={studentSteps} lineColor="border-primary/20" />
                    </TabsContent>

                    <TabsContent value="developer">
                        <StepsGrid steps={devSteps} lineColor="border-purple-500/20" variant="dev" />
                    </TabsContent>
                </Tabs>
            </div>
        </section>
    );
};

const StepsGrid = ({ steps, lineColor, variant = "default" }) => (
    <div className="relative grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-10 sm:gap-6 md:gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* Connecting line (desktop) */}
        <div className={`hidden lg:block absolute top-7 left-[14%] right-[14%] h-0.5 border-t-2 border-dashed ${lineColor} z-0`} />

        {steps.map((step, index) => (
            <div key={index} className="relative flex flex-col items-center text-center z-10 group">
                {/* Icon container */}
                <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center mb-5 shadow-lg relative transition-colors ${variant === 'dev' ? 'bg-purple-950 border-purple-800 shadow-purple-900/10' : 'bg-background border border-primary/20 shadow-primary/5 group-hover:border-primary/40'}`}>
                    <step.icon className={`w-6 h-6 sm:w-7 sm:h-7 ${variant === 'dev' ? 'text-purple-400' : 'text-primary'}`} />

                    {/* Step number */}
                    <div className={`absolute -top-2.5 -right-2.5 w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs border-2 border-background shadow-sm ${variant === 'dev' ? 'bg-purple-600 text-white' : 'bg-primary text-primary-foreground'}`}>
                        {index + 1}
                    </div>
                </div>

                <h3 className="text-base sm:text-lg font-bold mb-2">
                    {step.title}
                </h3>
                <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed max-w-[180px]">
                    {step.desc}
                </p>
            </div>
        ))}
    </div>
);