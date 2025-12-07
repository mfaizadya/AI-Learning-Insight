import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export const DashboardPageSkeleton = () => {
  return (
    <section className="max-sm:px-5">
      {/* header */}
      <section className="mb-8 md:mb-8 mt-4 md:mt-3 ms-1 md:ms-2 flex flex-col gap-2">
        <Skeleton className="h-8 md:h-10 w-48 rounded-lg bg-gray-200" />
        <Skeleton className="h-36 sm:h-8 md:h-5 w-full md:w-96 rounded-md bg-gray-100" />
      </section>

      {/* 2. Grid Skeleton */}
      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mb-16">
        {/* row 1 */}
        {[1, 2, 3].map((item) => (
          <div
            key={item}
            className="w-full rounded-2xl overflow-hidden border border-gray-100 bg-white shadow-sm"
          >
            <div className="h-full min-h-[10.5rem] p-6 flex flex-col justify-between">
              <div className="space-y-3">
                <Skeleton className="h-4 w-24 bg-gray-200" />
                <Skeleton className="h-8 w-3/4 bg-gray-200" />
              </div>
              <div className="flex justify-end mt-4">
                <Skeleton className="h-12 w-12 rounded-xl bg-gray-100" />
              </div>
            </div>
          </div>
        ))}

        {/* row 2 */}
        <div className="md:col-span-2 bg-[#FDFDFF] border border-gray-100 rounded-2xl p-6 h-full min-h-[25rem]">
          {/* Header Insight */}
          <div className="flex items-center gap-3 mb-6">
            <Skeleton className="h-8 w-8 rounded-full bg-gray-200" />
            <Skeleton className="h-6 w-48 bg-gray-200" />
          </div>

          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white border border-gray-100 p-4 rounded-2xl shadow-sm"
              >
                <Skeleton className="h-4 w-1/3 mb-2 bg-gray-200" />
                <Skeleton className="h-3 w-full bg-gray-100" />
                <Skeleton className="h-3 w-2/3 mt-1 bg-gray-100" />
              </div>
            ))}
          </div>
        </div>

        {/* Chart Skeleton */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 h-full min-h-[25rem] flex flex-col">
          <Skeleton className="h-6 w-40 mb-8 bg-gray-200" /> {/* Title Chart */}
          <div className="flex-1 flex items-center justify-center">
            <div className="relative">
              <Skeleton className="h-40 w-40 rounded-full bg-gray-100" />
              <div className="absolute inset-0 m-auto h-28 w-28 bg-white rounded-full flex items-center justify-center">
                <div className="flex flex-col items-center gap-1">
                  <Skeleton className="h-8 w-12 bg-gray-200" />
                  <Skeleton className="h-3 w-8 bg-gray-100" />
                </div>
              </div>
            </div>
          </div>
          {/* legend */}
          <div className="flex justify-center gap-4 mt-8 pt-4 border-t border-gray-50">
            <Skeleton className="h-3 w-16 bg-gray-100" />
            <Skeleton className="h-3 w-16 bg-gray-100" />
            <Skeleton className="h-3 w-16 bg-gray-100" />
          </div>
        </div>
      </section>
    </section>
  );
};
