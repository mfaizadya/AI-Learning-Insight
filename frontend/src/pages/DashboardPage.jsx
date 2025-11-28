import React from "react";
import { Label, Pie, PieChart, Sector } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartStyle,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Eye, Flame, ChartNoAxesColumn, Lightbulb } from "lucide-react";

// static dummy data for temporary chart mockup
const chartData = [
  { type: "visual", visitors: 90, fill: "#3F3370" }, 
  { type: "auditori", visitors: 7, fill: "#A090E0" }, 
  { type: "kinestetik", visitors: 3, fill: "#E2E8F0" },
];

const chartConfig = {
  visitors: { label: "Persentase" },
  visual: { label: "Visual", color: "#3F3370" },
  auditori: { label: "Auditori", color: "#A090E0" },
  kinestetik: { label: "Kinestetik", color: "#E2E8F0" },
};

export const DashboardPage = () => {
  const id = "pie-interactive";

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
      {/* ========================================================= */}
      {/* CARD 1: STREAK                                            */}
      {/* ========================================================= */}
      <Card className="bg-white shadow-sm transition-all duration-300 hover:border-2 hover:border-[#3b2f6e] border-2 border-transparent overflow-hidden relative rounded-2xl">
        <div className="absolute top-[-6] right-2 w-24 h-24 bg-transparent rounded-tl-xl rounded-tr-2xl rounded-br-2xl rounded-bl-2xl">
          <Flame size={160} className="text-[#EDE8FA]" />
        </div>
        <CardContent className="p-6 ps-6 flex flex-col gap-0 justify-center h-full relative z-10">
          <div className="flex items-baseline gap-2">
            <span className="text-[2.75rem] font-semibold text-[#3b2f6e] mt-5">
              30
            </span>
            <span className="text-[2.75rem] text-[#3b2f6e] font-normal">
              Days
            </span>
          </div>
          <div className="flex justify-start items-center gap-2 text-[#3b2f6e]">
            <span className="text-2xl font-normal low-highlight">Learning Streak</span>
          </div>
        </CardContent>
      </Card>

      {/* ========================================================= */}
      {/* CARD 2: GAYA BELAJAR                                      */}
      {/* ========================================================= */}
      <Card className="bg-[#EDE8FA] shadow-sm transition-all duration-300 hover:border-2 hover:border-[#3b2f6e] border-2 border-transparent rounded-2xl overflow-hidden flex flex-col h-full">
        <CardContent className="pt-0 px-0 pb-0 flex flex-col justify-between h-full">
          <div className="flex items-center justify-between p-6 px-9 mt-2">
            <h3 className="text-[#3F3370] text-[1.35rem] font-medium leading-tight">
              Gaya
              <br />
              belajarmu:
            </h3>
            <Eye className="h-16 w-16 text-[#3F3370]" strokeWidth={1.5} />
          </div>
          <div className="w-3/4 mx-auto bg-[#3F3370] text-white py-4 px-4 rounded-t-3xl text-center text-lg font-semibold shadow-[0_-4px_6px_-1px_rgba(63,51,112,0.1)] cursor-default">
            Visual Learner
          </div>
        </CardContent>
      </Card>

      {/* ========================================================= */}
      {/* CARD 3: POLA BELAJAR                                      */}
      {/* ========================================================= */}
      <Card className="bg-[#EDE8FA] shadow-sm transition-all duration-300 hover:border-2 hover:border-[#3b2f6e] border-2 border-transparent rounded-2xl overflow-hidden relative">
        <CardContent className="p-6 pb-0 flex items-center justify-between h-full relative z-10">
          <div className="flex flex-col justify-center">
            <p className="text-[#3F3370] font-medium text-base">
              Pola belajarmu:
            </p>
            <h3 className="text-2xl font-bold text-[#3F3370] mt-2 leading-tight">
              Consistent
              <br />
              Learner
            </h3>
          </div>
          <div className="bg-[#3F3370] absolute right-0 p-7 rounded-[1.2rem] shadow-lg shadow-purple-900/10 flex items-center justify-center ">
            <ChartNoAxesColumn size={40} className="text-white" />
          </div>
        </CardContent>
      </Card>

      {/* ========================================================= */}
      {/* CARD 4: ACTIONABLE                                        */}
      {/* ========================================================= */}
      <Card className="md:col-span-2 bg-[#FDFDFF] border border-transparent shadow-sm relative overflow-hidden rounded-2xl">
        <div className="absolute top-0 left-0 w-1.5 rounded-full h-full bg-[#3F3370]"></div>
        <CardHeader className="pb-2 pt-6 pl-8">
          <CardTitle className="text-[#3F3370] flex items-center gap-3 text-lg font-bold">
            <Lightbulb />
            Actionable Insight untukmu
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 pl-8 pr-6 pb-6 pt-4">
          <div className="bg-white border border-gray-100 p-4 rounded-2xl shadow-sm hover:border-purple-100 transition-colors">
            <h4 className="font-bold text-gray-800 text-sm mb-1">
              Anda merupakan Visual Learner:
            </h4>
            <p className="text-sm text-gray-500 leading-relaxed">
              Oleh karena itu, maksimalkan materi belajar yang berbasis visual
              seperti diagram, peta konsep, dan video pembelajaran. Hindari teks
              panjang tanpa ilustrasi.
            </p>
          </div>
          <div className="bg-white border border-gray-100 p-4 rounded-2xl shadow-sm hover:border-purple-100 transition-colors">
            <h4 className="font-bold text-gray-800 text-sm mb-1">
              Konsistensi Anda Sangat Baik:
            </h4>
            <p className="text-sm text-gray-500 leading-relaxed">
              Anda telah belajar selama 30 hari berturut-turut. Pertahankan
              ritme ini, namun jangan lupa untuk mengambil jeda istirahat
              (pomodoro) agar tidak burnout.
            </p>
          </div>
          <div className="bg-white border border-gray-100 p-4 rounded-2xl shadow-sm hover:border-purple-100 transition-colors">
            <h4 className="font-bold text-gray-800 text-sm mb-1">
              Lorem ipsum:
            </h4>
            <p className="text-sm text-gray-500 leading-relaxed">
              Lorem, ipsum dolor sit amet consectetur adipisicing elit. Dolorem possimus amet, nobis blanditiis pariatur praesentium recusandae corrupti cupiditate aperiam numquam nostrum dicta quo consequatur minima quibusdam aliquam vero voluptatem deserunt! Lorem ipsum, dolor sit amet consectetur adipisicing elit. Autem, esse repellat omnis.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* ========================================================= */}
      {/* CARD 5: PIE CHART - ALL ACTIVE                            */}
      {/* ========================================================= */}
      <Card
        data-chart={id}
        className="flex flex-col border-none shadow-sm rounded-2xl bg-white h-full max-h-[25rem]"
      >
        <ChartStyle id={id} config={chartConfig} />

        <CardHeader className="pb-0 pt-6 px-6">
          <CardTitle className="text-base font-bold text-[#3F3370]">
            Statistik Gaya Belajar
          </CardTitle>
        </CardHeader>

        <CardContent className="flex flex-1 justify-center pb-2 items-center min-h-[16.875rem]">
          <ChartContainer
            id={id}
            config={chartConfig}
            className="mx-auto aspect-square w-full max-w-[15.625rem] h-full"
          >
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Pie
                data={chartData}
                dataKey="visitors"
                nameKey="type"
                innerRadius={65}
                outerRadius={90}
                strokeWidth={5}
                shape={({
                  cx,
                  cy,
                  innerRadius,
                  outerRadius,
                  startAngle,
                  endAngle,
                  fill,
                }) => {
                  return (
                    <g>
                      {/* main donnut slice */}
                      <Sector
                        cx={cx}
                        cy={cy}
                        innerRadius={innerRadius}
                        outerRadius={outerRadius}
                        startAngle={startAngle}
                        endAngle={endAngle}
                        fill={fill}
                        stroke="#fff" // separator line
                        strokeWidth={2}
                      />
                      {/* outer line */}
                      <Sector
                        cx={cx}
                        cy={cy}
                        innerRadius={outerRadius + 6}
                        outerRadius={outerRadius + 12}
                        startAngle={startAngle}
                        endAngle={endAngle}
                        fill={fill}
                        stroke="#fff"
                        strokeWidth={2}
                      />
                    </g>
                  );
                }}
              >
                {/* center text */}
                <Label
                  content={({ viewBox }) => {
                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                      return (
                        <text
                          x={viewBox.cx}
                          y={viewBox.cy}
                          textAnchor="middle"
                          dominantBaseline="middle"
                        >
                          <tspan
                            x={viewBox.cx}
                            y={viewBox.cy}
                            className="fill-[#3F3370] text-4xl font-bold"
                          >
                            90%
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 24}
                            className="fill-gray-500 text-xs font-medium"
                          >
                            Visual
                          </tspan>
                        </text>
                      );
                    }
                  }}
                />
              </Pie>
            </PieChart>
          </ChartContainer>
        </CardContent>

        {/* static legend (btm) */}
        <div className="border-t p-4 bg-gray-50/50 rounded-b-xl">
          <div className="flex items-center justify-center gap-6">
            {chartData.map((item) => {
              const config = chartConfig[item.type];
              return (
                <div key={item.type} className="flex items-center gap-2">
                  <span
                    className="h-3 w-3 rounded-full shadow-sm"
                    style={{ backgroundColor: item.fill }}
                  />
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold tracking-wider text-gray-500">
                      {config?.label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default DashboardPage;
