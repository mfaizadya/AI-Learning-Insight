import {
  ChartNoAxesColumn,
  Loader2,
  AlertCircle,
  Zap,
  Repeat,
  Search,
  Scale,
} from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { useLastTestResult } from "@/hooks/useLastTestResult";

// desc
const getPatternDescription = (pattern) => {
  switch (pattern) {
    case "Consistent Learner":
      return "Ritme belajar yang stabil & terstruktur.";
    case "Fast Learner":
      return "Mampu menyerap & menyelesaikan materi dengan cepat.";
    case "Reflective Learner":
      return "Menghabiskan waktu untuk mendalami & mengulas materi.";
    case "Balanced Learner":
      return "Keseimbangan baik antara kecepatan & ketelitian.";
    default:
      return "Lakukan tes Pola Belajar untuk mendapatkan wawasan pribadi.";
  }
};

// ico's
const getPatternIcon = (patternType) => {
  if (!patternType || patternType === "Belum Tes") {
    return <AlertCircle size={40} className="text-white" />;
  }
  const lowerType = patternType.toLowerCase();

  if (lowerType.includes("fast"))
    return <Zap size={40} className="text-white" />;
  if (lowerType.includes("consistent"))
    return <Repeat size={40} className="text-white" />;
  if (lowerType.includes("reflective"))
    return <Search size={40} className="text-white" />;
  if (lowerType.includes("balanced"))
    return <Scale size={40} className="text-white" />;

  return <ChartNoAxesColumn size={40} className="text-white" />;
};

export const LearningPatternCard = ({ className = "", ...props }) => {
  const { lastResult, isLoading, error } = useLastTestResult();
  const patternType = lastResult?.title || "Belum Tes";

  let displayIcon;
  let patternText;
  let descriptionText;

  if (isLoading) {
    displayIcon = <Loader2 size={40} className="text-white animate-spin" />;
    patternText = "Memuat Pola...";
    descriptionText = "Menunggu analisis...";
  } else if (error || patternType === "Belum Tes") {
    displayIcon = getPatternIcon(patternType);
    patternText = patternType;
    descriptionText = getPatternDescription(patternType);
  } else {
    displayIcon = getPatternIcon(patternType);
    patternText = patternType;
    descriptionText = getPatternDescription(patternType);
  }

  const cardClass =
    patternType === "Belum Tes" || error
      ? "bg-secondary"
      : "bg-secondary";

  return (
    <Card
      className={`${cardClass} shadow-sm transition-all duration-300 border-none hover:ring-primary hover:ring-1 sm:hover:ring-2 rounded-2xl overflow-hidden relative ${className}`}
      {...props}
    >
      <CardContent className="p-6 pb-0 flex items-center justify-between h-full relative z-10">
        {/* left */}
        <div className="flex flex-col justify-center max-md:ms-2 gap-2">
          <h3 className="text-[1.4rem] sm:text-2xl font-semibold text-primary mt-2 leading-tight ">
            {(typeof patternText === "string"
              ? patternText
              : patternText.toString()
            )
              .split("  ")
              .map((word, i) => (
                <span
                  key={i}
                  className={`block ${
                    patternType === "Belum Tes" ? "text-primary italic" : ""
                  }`}
                >
                  {word}
                </span>
              ))}
          </h3>
          <p
            className={`text-primary font-normal text-sm sm:text-sm w-[65%] ${
              isLoading ? "animate-pulse" : ""
            }`}
          >
            {descriptionText}
          </p>
        </div>
        {/* right */}
        <div className="bg-primary absolute right-0 p-6 sm:p-7 rounded-[1.2rem] shadow-lg shadow-purple-900/10 flex items-center justify-center">
          {displayIcon}
        </div>
      </CardContent>
    </Card>
  );
};
