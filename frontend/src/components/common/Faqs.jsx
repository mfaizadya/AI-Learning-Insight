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
        <>
            <section className="py-24 px-6 bg-background">
                <div className="max-w-3xl md:max-w-4xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-semibold tracking-tight mb-4">
                            Frequently Asked Questions
                        </h2>
                        <p className="text-muted-foreground md:text-xl">
                            Pertanyaan umum seputar CerdasKu dan analisis gaya belajar.
                        </p>
                    </div>

                    <Accordion type="single" collapsible className="w-full space-y-4">
                        {faqs.map((faq, index) => (
                            <AccordionItem
                                key={index}
                                value={`item-${index}`}
                                className="border border-border/50 rounded-2xl bg-white shadow-xs px-6 md:px-7 md:py-2 lg:px-8 overflow-hidden transition-all duration-300 hover:border-primary/30 data-[state=open]:border-primary/30 data-[state=open]:bg-card/50"
                            >
                                <AccordionTrigger className="text-base md:text-lg lg:text-xl font-medium hover:text-primary hover:no-underline py-5 text-left [&[data-state=open]]:text-primary">
                                    {faq.question}
                                </AccordionTrigger>
                                <AccordionContent className="text-sm md:text-base lg:text-lg text-muted-foreground leading-relaxed pb-6 border-t border-border/50 pt-4">
                                    {faq.answer}
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </div>
            </section>
        </>
    )
}