import { ChartNoAxesColumn } from "lucide-react";
import { Card, CardContent } from "../ui/card";

export const LearningPatternCard = ({ patternData }) => (
  <Card className="bg-secondary shadow-sm transition-all duration-300 hover:border-2 hover:border-primary border-2 border-transparent rounded-2xl overflow-hidden relative">
    <CardContent className="p-6 pb-0 flex items-center justify-between h-full relative z-10">
      <div className="flex flex-col justify-center">
        <p className="text-primary font-normal text-base">
          {patternData.description}
        </p>
        <h3 className="text-2xl font-semibold text-primary mt-2 leading-tight">
          {patternData.type.split(" ").map((word, i) => (
            <span key={i} className="block">
              {word}
            </span>
          ))}
        </h3>
      </div>
      <div className="bg-primary absolute right-0 p-7 rounded-[1.2rem] shadow-lg shadow-purple-900/10 flex items-center justify-center">
        <ChartNoAxesColumn size={40} className="text-white" />
      </div>
    </CardContent>
  </Card>
);
