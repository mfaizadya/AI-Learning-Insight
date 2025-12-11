import { Sparkles } from "lucide-react";

export const AuthHeaderTitle = () => {
  return (
    <>
      <div className="lg:hidden text-center mb-5 mt-10">
        <h1 className="text-xl md:text-3xl font-bold text-[#3b2f6e] flex justify-center items-center gap-2">
          <Sparkles size={20} /> CerdasKu
        </h1>
        <p className="text-xs text-muted-foreground mt-1">
          Pattern & Style - AI Learning Insight
        </p>
      </div>
    </>
  );
};
