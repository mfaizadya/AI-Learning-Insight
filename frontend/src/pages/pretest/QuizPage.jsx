import React, { useState } from "react";
import ContentDrawer from "@/components/reusable/ContentDrawer";
import { Card } from "@/components/ui/card"; // Import Card dari shadcn/ui

export default function QuizPage() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});

  // dummy question
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
                      border-0 shadow-sm hover:shadow-md relative flex items-center justify-between
                      ${bgColor} 
                      ${isSelected ? `ring-2 ${activeRing}` : "ring-0"}
                    `}
                  >
                    <div className="py-6 px-6 flex-grow text-gray-800">
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

      {/* right side (Navigator Soal) */}
      <section className="w-full lg:w-[32%] shrink-0 flex flex-col">
        <div className="bg-primary border border-gray-200 rounded-3xl overflow-hidden shadow-sm h-fit">
          <header className="bg-primary py-5 px-6 text-center">
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
                    "bg-white text-primary border-2 border-primary font-extrabold shadow-md transform scale-105 z-10";
                } else if (isAnswered) {
                  boxClass =
                    "bg-muted text-primary border-2 border-transparent font-bold hover:bg-muted/80";
                } else {
                  boxClass =
                    "bg-gray-100 text-gray-400 border-2 border-transparent hover:bg-gray-200";
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
