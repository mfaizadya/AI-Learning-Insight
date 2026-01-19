import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

export const Faqs = () => {
    const generalFaqs = [
        {
            question: "Apa itu Metacognition as a Service?",
            answer:
                "Sebuah platform hybrid yang menyediakan infrastruktur kecerdasan untuk memahami 'cara belajar' (learning patterns). Kami melayani siswa langsung via dashboard, dan developer via API.",
        },
        {
            question: "Apakah hasil analisisnya akurat?",
            answer:
                "Kami menggunakan lapisan ganda: Machine Learning untuk presisi tinggi, dan algoritma heuristik sebagai fallback, memastikan akurasi dan ketersediaan layanan 100%.",
        },
        {
            question: "Apakah gratis untuk siswa?",
            answer:
                "Ya, versi basic untuk siswa sepenuhnya gratis. Anda mendapatkan akses ke tes psikometri dan laporan dasar gaya belajar.",
        },
    ];

    const devFaqs = [
        {
            question: "Bagaimana cara mendapatkan API Key?",
            answer:
                "Daftar akun, masuk ke Developer Dashboard, dan generate key Anda (tersedia format 'ck_live_' dan 'ck_sandbox_').",
        },
        {
            question: "Berapa Rate Limit untuk tier Sandbox?",
            answer:
                "Tier Sandbox dibatasi 100 request/menit dengan kuota bulanan 10,000 request. Cukup untuk development dan testing.",
        },
        {
            question: "Apakah data siswa aman (Privacy)?",
            answer:
                "Sangat aman. Kami hanya memproses fitur numerik (skor) untuk prediksi pola. Data identitas siswa dianonimkan melalui `student_external_id`.",
        },
    ];

    return (
        <section className="py-16 sm:py-20 md:py-24 px-4 sm:px-6 md:px-8 bg-background">
            <div className="max-w-3xl mx-auto">
                {/* Section header */}
                <div className="text-center mb-10 sm:mb-12">
                    <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight mb-3">
                        Frequently Asked Questions
                    </h2>
                    <p className="text-muted-foreground text-sm sm:text-base">
                        Pahami lebih dalam tentang ekosistem CerdasKu.
                    </p>
                </div>

                <Tabs defaultValue="general" className="w-full">
                    <div className="flex justify-center mb-8">
                        <TabsList className="grid w-full max-w-md grid-cols-2 bg-secondary/50">
                            <TabsTrigger value="general">Umum / Siswa</TabsTrigger>
                            <TabsTrigger value="developer">LMS & Institusi</TabsTrigger>
                        </TabsList>
                    </div>

                    <TabsContent value="general" className="space-y-4">
                        <Accordion type="single" collapsible className="w-full space-y-3">
                            {generalFaqs.map((faq, index) => (
                                <AccordionItem
                                    key={`gen-${index}`}
                                    value={`gen-${index}`}
                                    className="border border-border/50 rounded-xl bg-card/40 px-4 sm:px-6 hover:border-primary/20 transition-all"
                                >
                                    <AccordionTrigger className="text-left font-medium hover:text-primary hover:no-underline py-4">
                                        {faq.question}
                                    </AccordionTrigger>
                                    <AccordionContent className="text-muted-foreground leading-relaxed pb-4">
                                        {faq.answer}
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </TabsContent>

                    <TabsContent value="developer" className="space-y-4">
                        <Accordion type="single" collapsible className="w-full space-y-3">
                            <AccordionItem value="dev-intro" className="border border-purple-500/20 rounded-xl bg-purple-500/5 px-4 sm:px-6 hover:border-purple-500/40 transition-all">
                                <AccordionTrigger className="text-left font-medium text-purple-900/80 hover:text-purple-700 hover:no-underline py-4">
                                    Siapa yang bisa menggunakan API CerdasKu?
                                </AccordionTrigger>
                                <AccordionContent className="text-purple-900/60 leading-relaxed pb-4">
                                    API kami dirancang untuk <strong>Learning Management Systems (LMS)</strong>, Aplikasi Sekolah, dan Platform EdTech yang ingin mengintegrasikan analisis gaya belajar ke dalam sistem mereka sendiri.
                                </AccordionContent>
                            </AccordionItem>
                            {devFaqs.map((faq, index) => (
                                <AccordionItem
                                    key={`dev-${index}`}
                                    value={`dev-${index}`}
                                    className="border border-purple-500/20 rounded-xl bg-purple-500/5 px-4 sm:px-6 hover:border-purple-500/40 transition-all"
                                >
                                    <AccordionTrigger className="text-left font-medium text-purple-900/80 hover:text-purple-700 hover:no-underline py-4">
                                        {faq.question}
                                    </AccordionTrigger>
                                    <AccordionContent className="text-purple-900/60 leading-relaxed pb-4">
                                        {faq.answer}
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </TabsContent>
                </Tabs>
            </div>
        </section>
    );
};