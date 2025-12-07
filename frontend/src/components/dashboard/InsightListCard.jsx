import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lightbulb } from "lucide-react";

export const InsightListCard = ({ insights }) => (
  <Card className="md:col-span-2 bg-[#FDFDFF] border border-transparent shadow-sm relative overflow-hidden rounded-2xl">
    <div className="absolute top-0 left-0 w-1.5 rounded-full h-full bg-primary"></div>
    <CardHeader className="pb-2 pt-6 pl-8">
      <CardTitle className="text-primary flex items-center gap-3 text-lg font-bold">
        <Lightbulb />
        Actionable Insight untukmu
      </CardTitle>
    </CardHeader>
    <CardContent className="space-y-4 pl-8 pr-6 pb-6 pt-4">
      {insights.map((item) => (
        <div
          key={item.id}
          className="bg-white border border-gray-100 p-4 rounded-2xl shadow-sm hover:border-purple-100 transition-colors"
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
