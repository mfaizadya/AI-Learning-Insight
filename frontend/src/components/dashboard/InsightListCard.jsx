import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lightbulb } from "lucide-react";

export const InsightListCard = ({ insights, className }) => (
  <Card
    className={`md:col-span-2 bg-[#FDFDFF] border border-transparent shadow-sm relative overflow-hidden rounded-2xl ${className}`}
  >
    <div className="absolute top-0 left-0 w-1.5 rounded-full h-full bg-primary"></div>
    <CardHeader className="pb-2 pt-6 pl-8">
      <CardTitle className="text-primary flex items-center gap-3 text-base sm:text-lg font-bold">
        <Lightbulb className="w-5 h-5 sm:w-6 sm:h-6" />
        Actionable Insight untukmu
      </CardTitle>
    </CardHeader>
    <CardContent className="space-y-4 pt-3 sm:pt-4 sm:pl-8 sm:pr-6 sm:pb-6">
      {insights.map((item) => (
        <div
          key={item.id}
          className="bg-white sm:border border-gray-100 p-4 rounded-2xl shadow-sm hover:border-purple-100 transition-colors"
        >
          <h4 className="font-bold text-gray-800 text-sm mb-1">{item.title}</h4>
          <p className="text-sm text-gray-500 leading-relaxed">
            {item.description}
          </p>
        </div>
      ))}
    </CardContent>
  </Card>
);
