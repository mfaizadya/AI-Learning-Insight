import { Card, CardContent } from "../ui/card";

export const QuoteCard = ({ quote, className = "", ...props }) => (
  <Card
    className={`w-full bg-white shadow-sm transition-all duration-300 hover:border-primary border-2 border-transparent overflow-hidden relative rounded-2xl !p-0 ${className}`}
    {...props}
  >
    <CardContent className="!p-0 flex flex-col h-full gap-0">
      <div className="px-6 py-3">
        <h3 className="text-[#3b2f6e] text-center font-semibold text-[0.95rem] tracking-tight">
          Daily Quote
        </h3>
      </div>
      <div className="flex-1 !m-0 bg-secondary relative rounded-t-3xl rounded-b-2xl mx-5 mb-5 p-5 flex flex-col justify-center items-center">
        <span className="absolute top-4 left-5 text-[#3b2f6e] text-4xl font-serif leading-none select-none opacity-80">
          &ldquo;
        </span>
        <p className="text-[#3b2f6e] w-[90%] text-center font-normal px-2 z-10 italic">
          {quote.text}
        </p>
        <p className="text-[#3b2f6e] text-xs font-bold mt-3 opacity-80">
          - {quote.author}
        </p>
        <span className="absolute bottom-[-0.5rem] right-5 text-[#3b2f6e] text-4xl font-serif leading-none select-none opacity-80">
          &rdquo;
        </span>
      </div>
    </CardContent>
  </Card>
);
