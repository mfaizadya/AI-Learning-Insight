import React, { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartStyle,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Label, Pie, PieChart } from "recharts";
import { AlertCircle } from "lucide-react"; // Ikon tambahan untuk empty state

export const StatisticsChartCard = ({ data, className = "" }) => {
  const id = "pie-interactive";

  // 1. SAFE GUARD: Cek apakah data valid dan tidak kosong
  const hasData =
    Array.isArray(data) &&
    data.length > 0 &&
    data.some((item) => item.visitors > 0);

  const chartConfig = {
    visitors: { label: "Persentase" },
    visual: { label: "Visual" },
    auditori: { label: "Auditori" },
    kinestetik: { label: "Kinestetik" },
  };

  // 2. SAFE CALCULATION: Mencegah crash pada .reduce() jika array kosong
  const topData = useMemo(() => {
    if (!hasData) return { visitors: 0, type: "Belum Tes" };
    return data.reduce((prev, current) =>
      prev.visitors > current.visitors ? prev : current
    );
  }, [data, hasData]);

  // 3. EMPTY STATE UI: Tampilan jika user belum tes (tetap mempertahankan dimensi card)
  if (!hasData) {
    return (
      <Card
        className={`flex flex-col border-none shadow-sm rounded-2xl bg-white h-full max-h-[25rem] ${className}`}
      >
        <CardHeader className="pb-0 pt-6 px-6">
          <CardTitle className="text-base font-bold text-primary">
            Statistik Gaya Belajar
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-1 flex-col gap-3 justify-center pb-2 items-center min-h-[16.875rem] text-muted-foreground">
          <AlertCircle className="h-10 w-10 text-gray-300" />
          <p className="text-sm font-medium text-gray-400 text-center px-4">
            Belum ada data statistik.
            <br />
            Silakan lakukan tes terlebih dahulu.
          </p>
        </CardContent>
        {/* Footer kosong agar tinggi card tetap konsisten/mirip */}
        <div className="border-t p-4 bg-gray-50/50 rounded-b-xl min-h-[3.5rem]" />
      </Card>
    );
  }

  // 4. RENDER UTAMA (Jika data ada) - Styling original Anda 100% utuh
  return (
    <Card
      data-chart={id}
      className={`flex flex-col border-none shadow-sm rounded-2xl bg-white h-full max-h-[25rem] ${className}`}
    >
      <ChartStyle id={id} config={chartConfig} />
      <CardHeader className="pb-0 pt-6 px-6">
        <CardTitle className="text-base font-bold text-primary">
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
              data={data}
              dataKey="visitors"
              nameKey="type"
              innerRadius={65}
              outerRadius={90}
              strokeWidth={5}
            >
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
                          className="fill-primary text-4xl font-bold"
                        >
                          {topData.visitors}%
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-gray-500 text-xs font-medium capitalize"
                        >
                          {topData.type}
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
      {/* Legend */}
      <div className="border-t p-4 bg-gray-50/50 rounded-b-xl">
        <div className="flex items-center justify-center gap-6">
          {data.map((item) => (
            <div key={item.type} className="flex items-center gap-2">
              <span
                className="h-3 w-3 rounded-full shadow-sm"
                style={{ backgroundColor: item.fill }}
              />
              <div className="flex flex-col">
                <span className="text-[10px] font-bold tracking-wider text-gray-500 capitalize">
                  {item.type}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};
