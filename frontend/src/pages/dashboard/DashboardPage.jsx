import { InsightListCard } from "@/components/dashboard/InsightListCard";
import { LearningPatternCard } from "@/components/dashboard/LearningPatternCard";
import { LearningStyleCard } from "@/components/dashboard/LearningStyleCard";
import { QuoteCard } from "@/components/dashboard/QuoteCard";
import { StatisticsChartCard } from "@/components/dashboard/StatisticsChartCard";
import { useDashboardData } from "@/hooks/useDashboardData";
import { DashboardPageSkeleton } from "@/components/skeletons/DashboardPageSkeleton";
import { ArrowRight, ClipboardCheck, Sparkles } from "lucide-react";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";

const PretestActionBtn = ({ hasTested }) => {
  if (hasTested) {
    return (
      <Link to="/dashboard/pretest">
        <Button
          size="lg"
          className="bg-primary hover:bg-[#2e2555] text-white font-semibold rounded-full shadow-none hover:shadow-purple-900/30 transition-all active:scale-95 group h-12 px-5 sm:px-6"
        >
          <Sparkles className="mr-1 h-5 w-5 animate-pulse text-white" />
          <span>Mulai Pretest Sekarang</span>
          {/* <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" /> */}
        </Button>
      </Link>
    );
  }

  return (
    <Link to="/dashboard/pretest">
      <Button
        variant="outline"
        className="bg-white border-primary/30 text-primary hover:bg-purple-50 hover:text-primary hover:border-purple-200 font-semibold rounded-full transition-all active:scale-95 h-12 px-6 shadow-none"
      >
        <ClipboardCheck className="mr-1 h-4 w-4" />
        <span>Menu Pretest</span>
      </Button>
    </Link>
  );
};

const WelcomeHeader = ({ user, hasTested }) => (
  <section className="mb-8 sm:mb-8 md:mb-8 mt-5 md:mt-3 ms-1 md:ms-2 flex flex-col md:flex-row md:items-end justify-between gap-6">
    <div className="flex flex-col gap-1">
      <h1 className="max-sm:text-gray-400 max-sm:font-normal sm:font-semibold text-[1.2rem] sm:text-[1.65rem]">
        Hi, {user.name}!
      </h1>
      <p className="text-[1.65rem] sm:text-[1.1rem] font-normal text-black sm:text-muted-foreground leading-normal max-sm:w-[95%]">
        {hasTested
          ? "Berikut Ringkasan perkembangan belajarmu, untuk membantu memahami potensi diri lebih dalam."
          : "Yuk, cari tahu bagaimana sih, pola dan gaya belajarmu sekarang!"}
      </p>
    </div>
    <div className="flex-shrink-0">
      <PretestActionBtn hasTested={hasTested} />
    </div>
  </section>
);

export const DashboardPage = () => {
  const { data, isLoading, error } = useDashboardData();

  if (isLoading || !data) return <DashboardPageSkeleton />;

  if (error)
    return (
      <div className="p-10 text-center text-red-500">
        Error: Gagal memuat data dashboard.
      </div>
    );

  const hasUserTested =
    data.learningPattern?.type !== "Belum Tes" &&
    data.learningStyle?.type !== "Belum Tes";

  return (
    <>
      <section className="max-sm:px-5">
        <WelcomeHeader user={data.user} hasTested={hasUserTested} />
        <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mb-16">
          {/* row 1 */}
          <LearningStyleCard
            styleData={data.learningStyle}
            className="max-lg:h-[10.8rem] rounded-[1.25rem]"
          />
          <LearningPatternCard
            patternData={data.learningPattern}
            className="max-lg:h-[10.8rem] rounded-[1.25rem]"
          />
          <QuoteCard
            quote={data.user.quote}
            className="max-lg:h-[10.8rem] rounded-[1.25rem]"
          />
          {/* row 2 */}
          <InsightListCard
            insights={data.insights}
            className="rounded-[1.25rem]"
          />
          <StatisticsChartCard
            data={data.statistics}
            className="rounded-[1.25rem]"
          />
        </section>
      </section>
    </>
  );
};

export default DashboardPage;
