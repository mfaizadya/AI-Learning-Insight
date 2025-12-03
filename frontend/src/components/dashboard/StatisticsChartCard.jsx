import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartStyle, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Label, Pie, PieChart } from "recharts";

export const StatisticsChartCard = ({ data }) => {
  const id = "pie-interactive";

  const chartConfig = {
    visitors: { label: "Persentase" },
    visual: { label: "Visual" },
    auditori: { label: "Auditori" },
    kinestetik: { label: "Kinestetik" },
  };

  const topData = data.reduce((prev, current) =>
    prev.visitors > current.visitors ? prev : current
  );

  return (
    <Card
      data-chart={id}
      className="flex flex-col border-none shadow-sm rounded-2xl bg-white h-full max-h-[25rem]"
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
              // Render Custom Label di tengah
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
