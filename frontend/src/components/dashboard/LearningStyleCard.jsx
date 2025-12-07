import { Eye } from "lucide-react";
import { Card, CardContent } from "../ui/card";

export const LearningStyleCard = ({ styleData, className = "", ...props }) => (
  <Card
    className={`bg-secondary shadow-sm transition-all duration-300 hover:border-2 hover:border-primary border-2 border-transparent rounded-2xl overflow-hidden flex flex-col h-full ${className}`}
    {...props}
  >
    <CardContent className="pt-0 px-0 pb-0 flex flex-col justify-between h-full">
      <div className="flex items-center justify-between p-6 px-12 sm:px-11 mt-2">
        <h3 className="text-primary text-xl sm:text-[1.35rem] font-medium leading-tight">
          Gaya <br /> belajarmu:
        </h3>
        <Eye className="h-14 w-14 sm:h-16 sm:w-16 text-primary" strokeWidth={1.5} />
      </div>
      <div className="w-2/3 sm:w-3/4 mx-auto bg-primary text-white p-3 sm:py-4 sm:px-4 rounded-t-2xl sm:rounded-t-3xl text-center text-base sm:text-lg font-semibold shadow-[0_-4px_6px_-1px_rgba(63,51,112,0.1)] cursor-default flex items-center justify-center">
        {styleData.type}
      </div>
    </CardContent>
  </Card>
);
