import { Eye } from "lucide-react";
import { Card, CardContent } from "../ui/card";

export const LearningStyleCard = ({ styleData }) => (
  <Card className="bg-secondary shadow-sm transition-all duration-300 hover:border-2 hover:border-primary border-2 border-transparent rounded-2xl overflow-hidden flex flex-col h-full">
    <CardContent className="pt-0 px-0 pb-0 flex flex-col justify-between h-full">
      <div className="flex items-center justify-between p-6 px-11 mt-2">
        <h3 className="text-primary text-[1.35rem] font-medium leading-tight">
          Gaya <br /> belajarmu:
        </h3>
        <Eye className="h-16 w-16 text-primary" strokeWidth={1.5} />
      </div>
      <div className="w-3/4 mx-auto bg-primary text-white py-4 px-4 rounded-t-3xl text-center text-lg font-semibold shadow-[0_-4px_6px_-1px_rgba(63,51,112,0.1)] cursor-default">
        {styleData.type}
      </div>
    </CardContent>
  </Card>
);
