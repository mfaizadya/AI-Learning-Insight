import { AlertCircle, Ear, Eye, Hand, Loader2 } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { useLastTestResult } from "@/hooks/useLastTestResult";

const getStyleIcon = (styleType) => {
  // const size = 64; // h-16 w-16

  if (!styleType || styleType === "Belum Tes") {
    return (
      <AlertCircle
        className="h-16 w-16 sm:h-16 sm:w-16 text-primary"
        strokeWidth={1.5}
      />
    );
  }

  const lowerType = styleType.toLowerCase();

  if (lowerType.includes("visual")) {
    return (
      <Eye
        className={`h-16 w-16 sm:h-16 sm:w-16 text-primary`}
        strokeWidth={1.5}
      />
    );
  }
  if (lowerType.includes("auditori")) {
    return (
      <Ear
        className={`h-16 w-16 sm:h-16 sm:w-16 text-primary`}
        strokeWidth={1.5}
      />
    );
  }
  if (lowerType.includes("kinestetik")) {
    return (
      <Hand
        className={`h-16 w-16 sm:h-16 sm:w-16 text-primary`}
        strokeWidth={1.5}
      />
    );
  }

  return (
    <Eye className="h-16 w-16 sm:h-16 sm:w-16 text-primary" strokeWidth={1.5} />
  );
};

// main func/comp
export const LearningStyleCard = ({ styleData, className = "", ...props }) => {
  const { lastResult, isLoading, error } = useLastTestResult();

  const styleType = lastResult?.subtitle || "Belum Tes";
  const score = lastResult?.score || 0;

  let displayIcon = isLoading ? (
    <Loader2
      className="h-16 w-16 sm:h-16 sm:w-16 text-primary animate-spin"
      strokeWidth={1.5}
    />
  ) : (
    getStyleIcon(styleType)
  );

  const displayText =
    styleType === "Belum Tes" || error
      ? "Lakukan Tes Gaya"
      : `${styleType} (${score}%)`;

  const cardClass =
    styleType === "Belum Tes" || error
      ? "bg-gray-100/70 border border-gray-200"
      : "bg-secondary";

  return (
    <>
      <Card
        className={`bg-secondary shadow-sm transition-all duration-300 border-none hover:ring-primary hover:ring-1 sm:hover:ring-2 rounded-2xl overflow-hidden flex flex-col h-full ${className}`}
        {...props}
      >
        <CardContent className="pt-0 px-0 pb-0 flex flex-col justify-between h-full">
          {/*  */}
          <div className="flex items-center justify-between p-6 px-12 sm:px-11 mt-2">
            <h3 className="text-primary text-xl sm:text-[1.35rem] font-medium leading-tight">
              Gaya <br /> belajarmu:
            </h3>
            {displayIcon}
          </div>
          <div className="w-3/4 sm:w-3/4 mx-auto bg-primary text-white p-3 sm:py-4 sm:px-4 rounded-t-2xl sm:rounded-t-3xl text-center text-base sm:text-lg font-semibold shadow-[0_-4px_6px_-1px_rgba(63,51,112,0.1)] cursor-default flex items-center justify-center">
            {isLoading ? "Memuat..." : displayText}
          </div>
        </CardContent>
      </Card>
    </>
  );
};
