import {
  ChartNoAxesColumn,
  AlertCircle,
  Zap,
  Repeat,
  Search,
  Scale,
} from "lucide-react";
import { Card, CardContent } from "../ui/card";

const getPatternDescription = (pattern) => {
  if (!pattern)
    return "Lakukan tes Pola Belajar untuk mendapatkan wawasan pribadi.";

  const p = pattern.toLowerCase();

  if (p.includes("consistent"))
    return "Ritme belajar yang stabil & terstruktur.";
  if (p.includes("fast"))
    return "Mampu menyerap & menyelesaikan materi dengan cepat.";
  if (p.includes("reflective"))
    return "Menghabiskan waktu untuk mendalami & mengulas materi.";
  if (p.includes("balanced"))
    return "Keseimbangan baik antara kecepatan & ketelitian.";

  return "Lakukan tes Pola Belajar untuk mendapatkan wawasan pribadi.";
};

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

export const LearningPatternCard = ({
  patternData,
  className = "",
  ...props
}) => {
  const patternType = patternData?.type || "Belum Tes";

  const displayIcon = getPatternIcon(patternType);
  const patternText = patternType;
  const descriptionText = getPatternDescription(patternType);

  const cardClass =
    patternType === "Belum Tes"
      ? "bg-secondary"
      : "bg-secondary";

  return (
    <Card
      className={`${cardClass} shadow-sm transition-all duration-300 border-none hover:ring-primary hover:ring-1 sm:hover:ring-2 rounded-2xl overflow-hidden relative ${className}`}
      {...props}
    >
      <CardContent className="p-6 pb-0 flex items-center justify-between h-full relative z-10">
        {/* left side */}
        <div className="flex flex-col justify-center max-md:ms-2 gap-2">
          {/* title */}
          <h3 className="text-[1.4rem] sm:text-2xl font-semibold text-primary mt-2 leading-tight w-[85%]">
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

          {/* desc */}
          <p className="text-primary font-normal text-sm sm:text-sm w-[65%]">
            {descriptionText}
          </p>
        </div>

        {/* right icon */}
        <div className="bg-primary absolute right-0 p-6 sm:p-7 rounded-[1.2rem] shadow-lg shadow-purple-900/10 flex items-center justify-center">
          {displayIcon}
        </div>
      </CardContent>
    </Card>
  );
};
