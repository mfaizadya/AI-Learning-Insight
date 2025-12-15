import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import ContentDrawer from "@/components/reusable/ContentDrawer";
import { Card } from "@/components/ui/card";
import { Loader2, AlertCircle } from "lucide-react";
import testService from "@/services/test.service";
import { HistoryDetailModal } from "@/components/modals/HistoryDetailModal";
import { resultService } from "@/services/result.service";
import { useToast } from "@/hooks/use-toast"; 

const STORAGE_KEY = "asah_test_progress";

export default function TestPage() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [questionsData, setQuestionsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const [userAnswers, setUserAnswers] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : {};
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalClosing, setIsModalClosing] = useState(false);
  const [resultData, setResultData] = useState(null);

  const POLA_TEST_ID = import.meta.env.VITE_POLA_TEST_ID;
  const GAYA_TEST_ID = import.meta.env.VITE_GAYA_TEST_ID;

  // 1. Fetch Questions
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        const { pola, gaya } = await testService.getFullTestPackage(
          POLA_TEST_ID,
          GAYA_TEST_ID
        );

        const polaQuestions = pola.questions.map((q) => ({
          ...q,
          type: "pola",
          testId: POLA_TEST_ID,
        }));
        const gayaQuestions = gaya.questions.map((q) => ({
          ...q,
          type: "gaya",
          testId: GAYA_TEST_ID,
        }));

        setQuestionsData([...polaQuestions, ...gayaQuestions]);
      } catch (err) {
        console.error("Failed to fetch test data:", err);
        setError("Gagal memuat soal tes. Silakan coba lagi nanti.");
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [POLA_TEST_ID, GAYA_TEST_ID]);

  // autosave progres
  useEffect(() => {
    if (Object.keys(userAnswers).length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(userAnswers));
    }
  }, [userAnswers]);

  // helpers
  const currentQuestion = questionsData[currentQuestionIndex];
  const totalQuestions = questionsData.length;
  const isLastQuestion = currentQuestionIndex === totalQuestions - 1;
  const totalAnswered = Object.keys(userAnswers).length;
  const isAllAnswered = totalAnswered === totalQuestions;

  const handleOptionSelect = (choiceId) => {
    setUserAnswers((prev) => ({
      ...prev,
      [currentQuestionIndex]: {
        questionId: currentQuestion.id,
        choiceId: choiceId,
        type: currentQuestion.type,
      },
    }));
  };

  const handleNext = () => {
    if (!isLastQuestion) setCurrentQuestionIndex((prev) => prev + 1);
  };
  const handlePrev = () => {
    if (currentQuestionIndex > 0) setCurrentQuestionIndex((prev) => prev - 1);
  };
  const handleJumpToQuestion = (index) => {
    setCurrentQuestionIndex(index);
  };

  const handleSubmit = async () => {
    if (!isAllAnswered) {
      toast({
        variant: "destructive",
        title: "Jawaban Belum Lengkap",
        description: `Anda baru menjawab ${totalAnswered} dari ${totalQuestions} soal. Mohon lengkapi semua sebelum submit.`,
        duration: 4000,
      });
      return;
    }

    let resultIdPola = null;

    try {
      setIsSubmitting(true);

      const polaAnswers = [];
      const gayaAnswers = [];

      Object.values(userAnswers).forEach((ans) => {
        if (ans.type === "pola") {
          polaAnswers.push({
            soal_id: ans.questionId,
            pilihan_id: ans.choiceId,
          });
        } else if (ans.type === "gaya") {
          gayaAnswers.push({
            soal_id: ans.questionId,
            pilihan_id: ans.choiceId,
          });
        }
      });

      // console.log("Memulai submit Pola Belajar...");
      const polaResponse = await testService.submitPolaResult({
        test_id: POLA_TEST_ID,
        answers: polaAnswers,
      });

      resultIdPola = polaResponse?.data?.result_id;

      if (!resultIdPola) {
        throw new Error(
          "Gagal mendapatkan ID Hasil Pola. Submission Gaya dibatalkan."
        );
      }

      // console.log(`Pola Submitted. ID Hasil: ${resultIdPola}`);
      // console.log("Memulai submit Gaya Belajar...");
      await testService.submitGayaResult({
        test_id: GAYA_TEST_ID,
        answers: gayaAnswers,
        hasil_test_id: resultIdPola,
      });

      // clear localstorage onsuccess
      localStorage.removeItem(STORAGE_KEY);

      const fullResultResponse = await resultService.getHistoryDetail(
        resultIdPola
      );
      const finalResult = fullResultResponse?.data;

      if (!finalResult) {
        throw new Error("Gagal mengambil data hasil akhir yang lengkap.");
      }

      const finalResultForModal = {
        date: finalResult.date,
        duration: "Selesai",
        status: "Selesai",
        patternResult: finalResult.patternResult,
        styleResult: finalResult.styleResult,
        score: finalResult.score,
        styleBreakdown: finalResult.styleBreakdown,
        summary: finalResult.summary,
      };

      setResultData(finalResultForModal);
      setIsModalOpen(true);

      // Optional: Success Toast
      toast({
        title: "Tes Selesai!",
        description: "Hasil analisis belajar Anda telah siap.",
        className: "bg-green-50 border-green-200 text-green-800", 
      });
    } catch (err) {
      console.error("Submission error:", err);
      const errMsg =
        err.response?.data?.error ||
        err.message ||
        "Terjadi kesalahan saat memproses hasil tes.";

      toast({
        variant: "destructive",
        title: "Gagal Mengirim Jawaban",
        description: errMsg,
        action: <AlertCircle className="h-4 w-4" />, 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseModal = () => {
    setIsModalClosing(true);
    setTimeout(() => {
      setIsModalOpen(false);
      setIsModalClosing(false);
      navigate("/dashboard/pretest");
    }, 300);
  };

  const optionColors = [
    "bg-[#7ED4F7]",
    "bg-[#F9F871]",
    "bg-[#6EE7B7]",
    "bg-[#F0ABFC]",
  ];
  const bgColors = [
    "bg-[#E0F2FE]",
    "bg-[#FEFCE8]",
    "bg-[#ECFDF5]",
    "bg-[#FAF5FF]",
  ];
  const optionActiveRingColors = [
    "ring-[#7ED4F7]",
    "ring-[#F9F871]",
    "ring-[#6EE7B7]",
    "ring-[#F0ABFC]",
  ];

  if (loading) {
    return (
      <ContentDrawer>
        <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh] text-gray-500">
          <Loader2 className="w-10 h-10 animate-spin mb-4 text-primary" />
          <p>Memuat soal tes...</p>
        </div>
      </ContentDrawer>
    );
  }

  if (error) {
    return (
      <ContentDrawer>
        <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh] text-red-500">
          <p className="font-bold mb-2">Terjadi Kesalahan</p>
          <p>{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
          >
            Coba Lagi
          </button>
        </div>
      </ContentDrawer>
    );
  }

  if (!currentQuestion) return null;

  return (
    <>
      <ContentDrawer className="">
        {/* Left Side: Question Area */}
        <section className="flex-1 flex flex-col gap-6 min-w-0">
          <article className="bg-white border-none md:border border-gray-100 rounded-3xl sm:p-2 shadow-none flex flex-col h-full">
            <div className="p-5 sm:p-5 flex flex-col h-full">
              <header className="mb-7 sm:mb-10">
                <div className="flex justify-between items-start mb-5 sm:mb-3">
                  <h2 className="max-sm:hidden sm:visible text-lg sm:text-xl xl:text-xl font-bold text-gray-400">
                    Soal {currentQuestionIndex + 1}
                  </h2>
                  <span className="text-xs font-bold bg-gray-100 text-gray-500 px-3 py-1 rounded-full whitespace-nowrap">
                    {currentQuestionIndex + 1} / {totalQuestions}
                  </span>
                </div>
                <p className="text-gray-700 font-medium text-base sm:text-xl leading-relaxed max-w-md">
                  {currentQuestion.question}
                </p>
              </header>

              {/* Choices */}
              <div className="flex flex-col gap-4 mb-6 sm:mb-8 flex-1">
                {currentQuestion.choices &&
                  currentQuestion.choices.map((choice, idx) => {
                    const isSelected =
                      userAnswers[currentQuestionIndex]?.choiceId === choice.id;
                    const barColor = optionColors[idx % optionColors.length];
                    const bgColor = bgColors[idx % bgColors.length];
                    const activeRing = optionActiveRingColors[idx % 4];

                    return (
                      <Card
                        key={choice.id}
                        onClick={() => handleOptionSelect(choice.id)}
                        className={`w-full text-left p-0 rounded-xl sm:rounded-2xl font-semibold text-sm transition-all duration-200 cursor-pointer overflow-hidden border-0 relative flex items-center justify-between ${bgColor} ${
                          isSelected
                            ? `ring-1 sm:ring-2 ${activeRing}`
                            : "ring-0"
                        }`}
                      >
                        <div className="py-4 w-full sm:py-6 px-6 lg:py-5 flex-grow text-black text-[0.81rem] font-normal sm:text-sm md:text-sm 2xl:text-lg">
                          {choice.option_text}
                        </div>
                        <div
                          className={`w-3 sm:w-3 h-10 sm:h-10 rounded-full ${barColor} mr-4`}
                        ></div>
                      </Card>
                    );
                  })}
              </div>

              {/* Navigation Buttons */}
              <div className="mt-auto flex justify-between items-center pt-4">
                <button
                  onClick={handlePrev}
                  disabled={currentQuestionIndex === 0}
                  className="disabled:opacity-50 disabled:cursor-not-allowed bg-gray-100 hover:bg-gray-200 text-primary px-9 2xl:px-11 py-3 2xl:py-4 rounded-xl 2xl:rounded-2xl font-semibold text-sm sm:text-base md:text-base shadow-sm transition-transform active:scale-95 flex items-center gap-2"
                >
                  Previous
                </button>
                {isLastQuestion ? (
                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className={`px-9 2xl:px-11 py-3 2xl:py-4 rounded-xl 2xl:rounded-2xl font-semibold md:text-base text-sm shadow-sm transition-transform active:scale-95 flex items-center gap-2 ${
                      isAllAnswered
                        ? "bg-gray-100 hover:bg-gray-200 text-primary"
                        : "bg-gray-50 hover:bg-gray-100 text-gray-400"
                    } ${isSubmitting ? "opacity-70 cursor-not-allowed max-sm:px-4" : ""}`}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      "Submit"
                    )}
                  </button>
                ) : (
                  <button
                    onClick={handleNext}
                    disabled={currentQuestionIndex === totalQuestions - 1}
                    className="disabled:opacity-50 disabled:cursor-not-allowed bg-gray-100 hover:bg-gray-200 text-primary sm:text-base px-9 2xl:px-11 py-3 2xl:py-4 rounded-xl 2xl:rounded-2xl font-semibold text-sm md:text-base shadow-sm transition-transform active:scale-95 flex items-center gap-2"
                  >
                    Next
                  </button>
                )}
              </div>
            </div>
          </article>
        </section>

        {/* Right Side Navigation */}
        <section className="w-full lg:w-[32%] shrink-0 flex flex-col">
          <div className="sm:border-none border-gray-200 rounded-3xl overflow-hidden shadow-sm h-fit">
            <header className="bg-transparents p-5 pb-0 text-center">
              <h3 className="text-white font-medium text-[0.9rem] sm:text-base tracking-wide bg-primary p-4 rounded-[0.9rem]">
                List Pertanyaan
              </h3>
            </header>
            <div className="bg-white p-5 rounded-t-3xl min-h-[300px]">
              <div className="grid grid-cols-6 sm:grid-cols-5 2xl:grid-cols-5 gap-3">
                {questionsData.map((item, idx) => {
                  const isCurrent = idx === currentQuestionIndex;
                  const isAnswered = userAnswers[idx] !== undefined;
                  let boxClass = isCurrent
                    ? "bg-white text-primary border-2 border-primary font-bold transform scale-105 z-10"
                    : isAnswered
                    ? "bg-muted text-primary border-2 border-transparent font-bold hover:bg-muted/80"
                    : "bg-gray-100 text-gray-400 border-2 border-transparent hover:bg-gray-200";
                  return (
                    <div
                      key={idx}
                      onClick={() => handleJumpToQuestion(idx)}
                      className={`aspect-square p-0 rounded-[0.55rem] sm:rounded-[0.6rem] flex items-center justify-center text-base sm:text-base md:text-base xl:text-base 2xl:text-lg transition-all cursor-pointer select-none ${boxClass}`}
                    >
                      {idx + 1}
                    </div>
                  );
                })}
              </div>
              <div className="mt-8 flex flex-wrap justify-center gap-4 text-xs text-gray-500 font-medium">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full border-2 border-primary bg-white"></div>
                  <span>Aktif</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-muted"></div>
                  <span>Dijawab</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-gray-100"></div>
                  <span>Belum</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </ContentDrawer>

      <HistoryDetailModal
        isOpen={isModalOpen}
        isClosing={isModalClosing}
        data={resultData}
        onClose={handleCloseModal}
      />
    </>
  );
}
