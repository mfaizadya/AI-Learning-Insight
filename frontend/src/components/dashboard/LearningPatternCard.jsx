import { ChartNoAxesColumn } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { cn } from "@/lib/utils";

export const LearningPatternCard = ({
  patternData,
  className = "",
  ...props
}) => (
  <Card
    className={`bg-secondary shadow-sm transition-all duration-300 border-none hover:ring-primary hover:ring-1 sm:hover:ring-2 rounded-2xl overflow-hidden relative ${className}`}
    {...props}
  >
    <CardContent className="p-6 pb-0 flex items-center justify-between h-full relative z-10">
      {/* left */}
      <div className="flex flex-col justify-center max-md:ms-2">
        <p className="text-primary font-normal text-base">
          {patternData.description}
        </p>
        {/*  */}
        <h3 className="text-[1.4rem] sm:text-2xl font-semibold text-primary mt-2 leading-tight">
          {patternData.type.split(" ").map((word, i) => (
            <span key={i} className="block">
              {word}
            </span>
          ))}
        </h3>
      </div>
      {/* right */}
      <div className="bg-primary absolute right-0 p-6 sm:p-7 rounded-[1.2rem] shadow-lg shadow-purple-900/10 flex items-center justify-center">
        {/* icon */}
        <ChartNoAxesColumn size={40} className="text-white" />
      </div>
    </CardContent>
  </Card>
);
