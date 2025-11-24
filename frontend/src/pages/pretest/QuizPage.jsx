import React, { useState } from "react";
import ContentDrawer from "@/components/reusable/ContentDrawer";

export default function QuizPage() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});

  const questionsData = Array.from({ length: 16 }, (_, i) => ({
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
  //

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

  return (
    <ContentDrawer>
      <section className="flex-1 flex flex-col gap-6 min-w-0">
        <article className="bg-white border border-gray-100 rounded-3xl p-1 shadow-sm flex flex-col h-full">
          <div className="p-6 flex flex-col h-full">
            <header className="mb-8">
              <div className="flex justify-between items-start mb-2">
                <h2 className="text-lg font-bold text-gray-900">
                  {currentQuestion.questionText}
                </h2>
                <span className="text-xs font-bold bg-gray-100 text-gray-500 px-3 py-1 rounded-full whitespace-nowrap ml-2">
                  {currentQuestionIndex + 1} / {totalQuestions}
                </span>
              </div>

              <p className="text-gray-500 font-medium text-base leading-relaxed max-w-md">
                {currentQuestion.description}
              </p>
            </header>

            <div className="flex flex-col gap-4 mb-8 flex-1">
              {currentQuestion.options.map((option, idx) => {
                const isSelected = userAnswers[currentQuestion.id] === idx;

                return (
                  <button
                    key={idx}
                    onClick={() => handleOptionSelect(idx)}
                    className={`
                      w-full text-left py-4 px-6 rounded-2xl font-semibold text-sm transition-all duration-200 outline-none border-2
                      ${
                        isSelected
                          ? "bg-[#EEF2FF] text-[#4A3B80] border-[#4A3B80]"
                          : "bg-[#EEF2FF] text-gray-700 border-transparent hover:bg-[#EEF2FF] hover:text-[#4A3B80]"
                      }
                    `}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
            {/* next prev nav */}
            <div className="mt-auto flex justify-between items-center pt-4">
              {/* btn's */}
              <button
                onClick={handlePrev}
                disabled={currentQuestionIndex === 0}
                className="disabled:opacity-50 disabled:cursor-not-allowed bg-[#4A3B80] hover:bg-[#382c63] text-white px-8 py-3 rounded-xl font-bold text-sm shadow-md transition-transform active:scale-95 flex items-center gap-2"
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
                        ? "bg-[#4A3B80] text-[#EEF2FF]"
                        : "bg-[#EEF2FF] text-[#4A3B80]"
                    }
                  `}
                >
                  Submit
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  disabled={currentQuestionIndex === totalQuestions - 1}
                  className="disabled:opacity-50 disabled:cursor-not-allowed bg-[#4A3B80] hover:bg-[#382c63] text-white px-10 py-3 rounded-xl font-bold text-sm shadow-md transition-transform active:scale-95 flex items-center gap-2"
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
        <div className="bg-[#4c3a75] border border-gray-200 rounded-3xl overflow-hidden shadow-sm h-fit">
          <header className="bg-[#4c3a75] py-5 px-6 text-center">
            <h3 className="text-white font-medium text-base tracking-wide">
              List Pertanyaan
            </h3>
          </header>

          <div className="bg-white p-6 rounded-t-3xl min-h-[300px]">
            <div className="grid grid-cols-4 gap-3">
              {questionsData.map((item, idx) => {
                const isCurrent = idx === currentQuestionIndex;
                const isAnswered = userAnswers[item.id] !== undefined;

                let boxClass = "";

                if (isCurrent) {
                  boxClass =
                    "bg-white text-[#4A3B80] border-2 border-[#4A3B80] font-extrabold shadow-md transform scale-105 z-10";
                } else if (isAnswered) {
                  boxClass =
                    "bg-[#EEF2FF] text-[#4A3B80] border-2 border-transparent font-bold hover:bg-[#E0E7FF]";
                } else {
                  boxClass =
                    "bg-[#F3F4F6] text-gray-400 border-2 border-transparent hover:bg-gray-200";
                }

                return (
                  <div
                    key={item.id}
                    onClick={() => handleJumpToQuestion(idx)}
                    className={`
                      aspect-square rounded-[0.8rem] flex items-center justify-center text-sm transition-all cursor-pointer select-none
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
                <div className="w-3 h-3 rounded-full border-2 border-[#4A3B80] bg-white"></div>
                <span>Aktif</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-[#EEF2FF]"></div>
                <span>Dijawab</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-[#F3F4F6]"></div>
                <span>Belum</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </ContentDrawer>
  );
}
