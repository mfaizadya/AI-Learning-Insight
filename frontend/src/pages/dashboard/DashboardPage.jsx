import { InsightListCard } from "@/components/dashboard/InsightListCard";
import { LearningPatternCard } from "@/components/dashboard/LearningPatternCard";
import { LearningStyleCard } from "@/components/dashboard/LearningStyleCard";
import { QuoteCard } from "@/components/dashboard/QuoteCard";
import { StatisticsChartCard } from "@/components/dashboard/StatisticsChartCard";
import { useDashboardData } from "@/hooks/useDashboardData";

import { Loader2 } from "lucide-react";

// sub comps
const LoadingState = () => (
  <div className="flex h-[50vh] w-full items-center justify-center flex-col gap-4">
    <Loader2 className="h-10 w-10 animate-spin text-primary" />
    <p className="text-muted-foreground animate-pulse">
      Menyiapkan Insight Belajarmu...
    </p>
  </div>
);

const WelcomeHeader = ({ user }) => (
  <section className="mb-8 md:mb-8 mt-4 md:mt-3 ms-1 md:ms-2 flex flex-col gap-1">
    <h1 className="font-semibold text-[1.3rem] md:text-[1.65rem]">
      Hi, {user.name}!
    </h1>
    <p className="text-sm md:text-[1.05rem] font-normal text-muted-foreground leading-relaxed">
      Berikut adalah ringkasan perkembangan belajar kamu minggu ini.
    </p>
  </section>
);

export const DashboardPage = () => {
  const { data, isLoading, error } = useDashboardData();
  if (isLoading) return <LoadingState />;
  if (error)
    return <div className="p-10 text-center text-red-500">Error...</div>;

  return (
    <>
      <section className="max-sm:px-5">
        <WelcomeHeader user={data.user} />

        <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mb-16">
          {/* row 1 */}
          <LearningStyleCard
            styleData={data.learningStyle}
            className="max-lg:h-[10.5rem]"
          />
          <LearningPatternCard
            patternData={data.learningPattern}
            className="max-lg:h-[10.5rem]"
          />
          <QuoteCard quote={data.user.quote} className="max-lg:h-[10.5rem]" />

          {/* row 2 */}
          <InsightListCard insights={data.insights} />
          <StatisticsChartCard data={data.statistics} />
        </section>
      </section>
    </>
  );
};

export default DashboardPage;
