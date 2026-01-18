import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion";

export const Faqs = () => {
    const faqs = [
        {
            question: "Apakah tes ini berbayar?",
            answer:
                "Tidak, CerdasKu sepenuhnya gratis untuk digunakan oleh siswa dan pelajar yang ingin memahami gaya belajar mereka.",
        },
        {
            question: "Berapa lama waktu yang dibutuhkan untuk tes?",
            answer:
                "Tes asesmen dirancang efisien dan biasanya memakan waktu sekitar 10-15 menit untuk diselesaikan.",
        },
        {
            question: "Apakah hasil analisisnya akurat?",
            answer:
                "Kami menggunakan algoritma machine learning yang dilatih dengan data psikometrik untuk memberikan prediksi gaya belajar yang mendekati akurat berdasarkan pola jawaban Anda.",
        },
        {
            question: "Bisakah saya mengulang tes?",
            answer:
                "Ya, Anda dapat mengambil tes ulang secara berkala untuk melihat perkembangan atau perubahan gaya belajar Anda seiring waktu.",
        },
    ];

    return (
        <section className="py-16 sm:py-20 md:py-24 px-4 sm:px-6 md:px-8 bg-background">
            <div className="max-w-2xl md:max-w-3xl mx-auto">
                {/* Section header */}
                <div className="text-center mb-10 sm:mb-12 md:mb-14">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight mb-2 sm:mb-3">
                        Frequently Asked Questions
                    </h2>
                    <p className="text-muted-foreground text-sm sm:text-base md:text-lg">
                        Pertanyaan umum seputar CerdasKu dan analisis gaya belajar.
                    </p>
                </div>

                <Accordion type="single" collapsible className="w-full space-y-3 sm:space-y-4">
                    {faqs.map((faq, index) => (
                        <AccordionItem
                            key={index}
                            value={`item-${index}`}
                            className="border border-border/50 rounded-xl sm:rounded-2xl bg-card/50 shadow-sm px-4 sm:px-5 md:px-6 overflow-hidden transition-all duration-300 hover:border-primary/30 data-[state=open]:border-primary/30 data-[state=open]:bg-card"
                        >
                            <AccordionTrigger className="text-sm sm:text-base md:text-lg font-medium hover:text-primary hover:no-underline py-4 sm:py-5 text-left [&[data-state=open]]:text-primary">
                                {faq.question}
                            </AccordionTrigger>
                            <AccordionContent className="text-xs sm:text-sm md:text-base text-muted-foreground leading-relaxed pb-4 sm:pb-5 border-t border-border/50 pt-3 sm:pt-4">
                                {faq.answer}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </div>
        </section>
    );
};