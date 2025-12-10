import React, { useState } from "react";
import ContentDrawer from "@/components/reusable/ContentDrawer";
import { Card } from "@/components/ui/card"; // Import Card dari shadcn/ui

export default function QuizPage() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});

  // dummy question
  const questionsData = Array.from({ length: 15 }, (_, i) => ({
    id: i + 1,
    questionText: `Soal ${i + 1}`,
    description: `Lorem ipsum dolor sit amet, ini adalah detail pertanyaan untuk nomor ${
      i + 1
    }. Pilih jawaban yang paling tepat.`,
    options: [`Jawaban A`, `Jawaban B`, `Jawaban C`, `Jawaban D`],
  }));

  // helpers
  const currentQuestion = questionsData[currentQuestionIndex];
  const totalQuestions = questionsData.length;
  const isLastQuestion = currentQuestionIndex === totalQuestions - 1;
  const totalAnswered = Object.keys(userAnswers).length;
  const isAllAnswered = totalAnswered === totalQuestions;

  // handle choice answer
  const handleOptionSelect = (optionIdx) => {
    setUserAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: optionIdx,
    }));
  };

  // next / prev handler
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

  // handle submit
  const handleSubmit = () => {
    if (isAllAnswered) {
      console.log("Payload Submit:", userAnswers);
      alert("Jawaban berhasil disubmit! Cek console untuk detail payload.");
    } else {
      alert(
        `Anda baru menjawab ${totalAnswered} dari ${totalQuestions} soal. Harap lengkapi semua jawaban sebelum submit.`
      );
    }
  };

  const handleJumpToQuestion = (index) => {
    setCurrentQuestionIndex(index);
  };

  const optionColors = [
    "bg-[#7ED4F7]", // youngblue
    "bg-[#F9F871]", // yellow
    "bg-[#6EE7B7]", // green
    "bg-[#F0ABFC]", // pink
  ];

  const bgColors = [
    "bg-[#E0F2FE]", // lightblue
    "bg-[#FEFCE8]", // light yellow
    "bg-[#ECFDF5]", // lightgreen
    "bg-[#FAF5FF]", // light pink
  ];

  // ring (selection)
  const optionActiveRingColors = [
    "ring-[#7ED4F7]",
    "ring-[#F9F871]",
    "ring-[#6EE7B7]",
    "ring-[#F0ABFC]",
  ];

  return (
    <ContentDrawer className="">
      {/* left side */}
      <section className="flex-1 flex flex-col gap-6 min-w-0">
        <article className="bg-white border-none md:border border-gray-100 rounded-3xl sm:p-2 shadow-sm flex flex-col h-full">
          {/*  */}
          <div className="p-5 sm:p-5 flex flex-col h-full">
            <header className="mb-7 sm:mb-10">
              <div className="flex justify-between items-start mb-5 sm:mb-3">
                {/*  */}
                <h2 className="max-sm:hidden sm:visible text-lg sm:text-xl xl:text-xl font-bold text-gray-900">
                  {currentQuestion.questionText}
                </h2>
                {/* current question badge */}
                <span className="text-xs font-bold bg-gray-100 text-gray-500 px-3 py-1 rounded-full whitespace-nowrap">
                  {currentQuestionIndex + 1} / {totalQuestions}
                </span>
              </div>
              {/* question */}
              <p className="text-gray-500 font-normal text-base sm:text-lg leading-relaxed max-w-md">
                {currentQuestion.description}
              </p>
            </header>

            <div className="flex flex-col gap-4 mb-6 sm:mb-8 flex-1">
              {currentQuestion.options.map((option, idx) => {
                const isSelected = userAnswers[currentQuestion.id] === idx;
                // get color w index
                const barColor = optionColors[idx % optionColors.length];
                const bgColor = bgColors[idx % bgColors.length];
                const activeRing = optionActiveRingColors[idx % 4];

                return (
                  <Card
                    key={idx}
                    onClick={() => handleOptionSelect(idx)}
                    className={`
                      w-full text-left p-0 rounded-2xl font-semibold text-sm transition-all duration-200 cursor-pointer overflow-hidden
                      border-0 relative flex items-center justify-between
                      ${bgColor} 
                      ${
                        isSelected ? `ring-1 sm:ring-2 ${activeRing}` : "ring-0"
                      }
                    `}
                  >
                    <div className="py-5 sm:py-6 px-6 flex-grow text-gray-800 text-[0.81rem] sm:text-sm 2xl:text-base">
                      {option} . . . .{/* <br />. . . . */}
                    </div>
                    <div
                      className={`w-3 h-10 rounded-full ${barColor} mr-4`}
                    ></div>
                  </Card>
                );
              })}
            </div>

            {/* next prev nav */}
            <div className="mt-auto flex justify-between items-center pt-4">
              {/* btn's */}
              <button
                onClick={handlePrev}
                disabled={currentQuestionIndex === 0}
                className="disabled:opacity-50 disabled:cursor-not-allowed bg-primary hover:bg-[#382c63] text-white px-8 py-3 rounded-xl font-bold text-sm shadow-md transition-transform active:scale-95 flex items-center gap-2"
              >
                Previous
              </button>

              {isLastQuestion ? (
                <button
                  onClick={handleSubmit}
                  className={`
                    px-10 py-3 rounded-xl font-bold text-sm shadow-md transition-transform active:scale-95 flex items-center gap-2 
                    ${
                      isAllAnswered
                        ? "bg-primary text-white"
                        : "bg-muted text-primary"
                    }
                  `}
                >
                  Submit
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  disabled={currentQuestionIndex === totalQuestions - 1}
                  className="disabled:opacity-50 disabled:cursor-not-allowed bg-primary hover:bg-[#382c63] text-white px-10 py-3 rounded-xl font-bold text-sm shadow-md transition-transform active:scale-95 flex items-center gap-2"
                >
                  Next
                </button>
              )}
            </div>
          </div>
        </article>
      </section>

      {/* right side */}
      <section className="w-full lg:w-[32%] shrink-0 flex flex-col">
        <div className="sm:border-none border-gray-200 rounded-3xl overflow-hidden shadow-sm h-fit">
          <header className="bg-transparents p-5 pb-0 text-center">
            <h3 className="text-black font-medium text-sm sm:text-base tracking-wide bg-[#EEF2FF] p-4 rounded-[0.9rem]">
              List Pertanyaan
            </h3>
          </header>
          <div className="bg-white p-5 rounded-t-3xl min-h-[300px]">
            <div className="grid grid-cols-5 sm:grid-cols-4 gap-3">
              {questionsData.map((item, idx) => {
                const isCurrent = idx === currentQuestionIndex;
                const isAnswered = userAnswers[item.id] !== undefined;
                let boxClass = "";

                if (isCurrent) {
                  boxClass =
                    "bg-white text-primary border-2 border-primary font-bold shadow-md transform scale-105 z-10";
                } else if (isAnswered) {
                  boxClass =
                    "bg-muted text-primary border-2 border-transparent font-bold hover:bg-muted/80";
                } else {
                  boxClass =
                    "bg-gray-100 text-gray-400 border-2 border-transparent hover:bg-gray-200";
                }

                return (
                  // question number lists box
                  <div
                    key={item.id}
                    onClick={() => handleJumpToQuestion(idx)}
                    className={`
                      aspect-square p-0 rounded-[0.8rem] flex items-center justify-center text-base sm:text-base md:text-lg transition-all cursor-pointer select-none
                      ${boxClass}
                    `}
                  >
                    {item.id}
                  </div>
                );
              })}
            </div>

            {/* legends */}
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
