import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import ContentDrawer from "@/components/reusable/ContentDrawer";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import testService from "@/services/test.service";

export default function TestPage() {
  const navigate = useNavigate();
  // State for Data & UI
  const [questionsData, setQuestionsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for Logic
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  // userAnswers format: { [questionId_type]: choiceId }
  // Example: { "1_pola": 2, "10_gaya": 15 }
  const [userAnswers, setUserAnswers] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Constants var
  const POLA_TEST_ID = import.meta.env.VITE_POLA_TEST_ID;
  const GAYA_TEST_ID = import.meta.env.VITE_GAYA_TEST_ID;

  // Fetch Data on Mount
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        // Use the helper we created in testService
        const { pola, gaya } = await testService.getFullTestPackage(
          POLA_TEST_ID,
          GAYA_TEST_ID
        );

        // Normalize Data for UI
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

        // Combine them: 1-9 (Pola) + 10-15 (Gaya)
        setQuestionsData([...polaQuestions, ...gayaQuestions]);
      } catch (err) {
        console.error("Failed to fetch test data:", err);
        setError("Gagal memuat soal tes. Silakan coba lagi nanti.");
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  // Helpers
  const currentQuestion = questionsData[currentQuestionIndex];
  const totalQuestions = questionsData.length;
  const isLastQuestion = currentQuestionIndex === totalQuestions - 1;
  const totalAnswered = Object.keys(userAnswers).length;
  const isAllAnswered = totalAnswered === totalQuestions;

  // Handle Answer Selection
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

  // Navigation Handlers
  const handleNext = () => {
    if (!isLastQuestion) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const handleJumpToQuestion = (index) => {
    setCurrentQuestionIndex(index);
  };

  // Submit Logic
  const handleSubmit = async () => {
    if (!isAllAnswered) {
      alert(
        `Anda baru menjawab ${totalAnswered} dari ${totalQuestions} soal. Harap lengkapi semua jawaban.`
      );
      return;
    }

    try {
      setIsSubmitting(true);

      // Prepare Payloads
      const polaAnswers = [];
      const gayaAnswers = [];

      // Iterate through our userAnswers state
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

      // Create Promise Array for Parallel Submission
      const submissionPromises = [];

      if (polaAnswers.length > 0) {
        submissionPromises.push(
          testService.submitPolaResult({
            test_id: POLA_TEST_ID,
            answers: polaAnswers,
          })
        );
      }

      if (gayaAnswers.length > 0) {
        submissionPromises.push(
          testService.submitGayaResult({
            test_id: GAYA_TEST_ID,
            answers: gayaAnswers,
          })
        );
      }

      // Execute Submission
      const results = await Promise.all(submissionPromises);
      console.log("Submission Results:", results);

      // Navigate to History/Result Page
      const resultId = results[0]?.data?.result_id;

      // Navigate to History (as per your route structure)
      navigate("/dashboard/pretest");
      alert("Tes berhasil disubmit!");
    } catch (err) {
      console.error("Submission error:", err);
      alert("Terjadi kesalahan saat mengirim jawaban. Silakan coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // UI Constants (Preserved from your code)
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

  // Render Loading
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

  // Render Error
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

  // Render Main Content (Only if questions exist)
  if (!currentQuestion) return null;

  return (
    <ContentDrawer className="">
      {/* Left Side: Question Area */}
      <section className="flex-1 flex flex-col gap-6 min-w-0">
        <article className="bg-white border-none md:border border-gray-100 rounded-3xl sm:p-2 shadow-none flex flex-col h-full">
          <div className="p-5 sm:p-5 flex flex-col h-full">
            <header className="mb-7 sm:mb-10">
              <div className="flex justify-between items-start mb-5 sm:mb-3">
                <h2 className="max-sm:hidden sm:visible text-lg sm:text-xl xl:text-xl font-bold text-gray-400">
                  {/* Dynamic Question Title */}
                  Soal {currentQuestionIndex + 1}
                </h2>
                {/* Badge */}
                <span className="text-xs font-bold bg-gray-100 text-gray-500 px-3 py-1 rounded-full whitespace-nowrap">
                  {currentQuestionIndex + 1} / {totalQuestions}
                </span>
              </div>
              {/* Question Text */}
              <p className="text-gray-700 font-medium text-base sm:text-xl leading-relaxed max-w-md">
                {currentQuestion.question}
              </p>
            </header>

            {/* Choices / Options */}
            <div className="flex flex-col gap-4 mb-6 sm:mb-8 flex-1">
              {currentQuestion.choices &&
                currentQuestion.choices.map((choice, idx) => {
                  // Check if this choice is selected in our userAnswers state
                  // userAnswers[currentQuestionIndex] stores the object { choiceId: ... }
                  const isSelected =
                    userAnswers[currentQuestionIndex]?.choiceId === choice.id;

                  // UI Styling logic (Preserved)
                  const barColor = optionColors[idx % optionColors.length];
                  const bgColor = bgColors[idx % bgColors.length];
                  const activeRing = optionActiveRingColors[idx % 4];

                  return (
                    <Card
                      key={choice.id} // Use unique Choice ID from DB
                      onClick={() => handleOptionSelect(choice.id)}
                      className={`
                      w-full text-left p-0 rounded-xl sm:rounded-2xl font-semibold text-sm transition-all duration-200 cursor-pointer overflow-hidden
                      border-0 relative flex items-center justify-between
                      ${bgColor} 
                      ${
                        isSelected ? `ring-1 sm:ring-2 ${activeRing}` : "ring-0"
                      }
                    `}
                    >
                      {/* option/answer text */}
                      <div className="py-4 w-full sm:py-6 px-6 lg:py-5 flex-grow text-gray-900 text-[0.81rem] font-normal sm:text-sm md:text-base 2xl:text-lg">
                        {choice.option_text}
                      </div>
                      {/* shape */}
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
                  className={`
                    px-9 2xl:px-11 py-3 2xl:py-4 rounded-xl 2xl:rounded-2xl font-semibold md:text-base text-sm shadow-sm transition-transform active:scale-95 flex items-center gap-2 
                    ${
                      isAllAnswered
                        ? "bg-gray-100 hover:bg-gray-200 text-primary"
                        : "bg-gray-50 hover:bg-gray-100 text-gray-400"
                    }
                    ${isSubmitting ? "opacity-70 cursor-not-allowed" : ""}
                  `}
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

      {/* Right Side: Question List Navigation */}
      <section className="w-full lg:w-[32%] shrink-0 flex flex-col">
        <div className="sm:border-none border-gray-200 rounded-3xl overflow-hidden shadow-sm h-fit">
          <header className="bg-transparents p-5 pb-0 text-center">
            <h3 className="text-black font-medium text-sm sm:text-base tracking-wide bg-[#EEF2FF] p-4 rounded-[0.9rem]">
              List Pertanyaan
            </h3>
          </header>
          <div className="bg-white p-5 rounded-t-3xl min-h-[300px]">
            <div className="grid grid-cols-6 sm:grid-cols-5 2xl:grid-cols-5 gap-3">
              {questionsData.map((item, idx) => {
                const isCurrent = idx === currentQuestionIndex;
                const isAnswered = userAnswers[idx] !== undefined; // Check by Index

                let boxClass = "";
                if (isCurrent) {
                  boxClass =
                    "bg-white text-primary border-2 border-primary font-bold transform scale-105 z-10";
                } else if (isAnswered) {
                  boxClass =
                    "bg-muted text-primary border-2 border-transparent font-bold hover:bg-muted/80";
                } else {
                  boxClass =
                    "bg-gray-100 text-gray-400 border-2 border-transparent hover:bg-gray-200";
                }

                return (
                  <div
                    // Using index as key is safe here since list is static after load
                    key={idx}
                    onClick={() => handleJumpToQuestion(idx)}
                    className={`
                      aspect-square p-0 rounded-[0.8rem] sm:rounded-[0.6rem] flex items-center justify-center text-base sm:text-base md:text-base xl:text-base 2xl:text-lg transition-all cursor-pointer select-none
                      ${boxClass}
                    `}
                  >
                    {idx + 1}
                  </div>
                );
              })}
            </div>

            {/* Legends */}
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
  );
}
