import React from "react";
import ContentDrawer from "@/components/reusable/ContentDrawer";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";

export const PretestPageSkeleton = () => {
  return (
    <ContentDrawer>
      <div className="flex flex-col lg:flex-row gap-6 w-full h-full relative">
        {/* ========================================= */}
        {/* LEFT SIDE                                 */}
        {/* ========================================= */}
        <section className="flex-1 flex flex-col justify-center gap-6 min-w-0">
          <div className="bg-white rounded-3xl p-1 flex flex-col shadow-sm border border-gray-50 h-full">
            <div className="p-5 px-4 sm:p-6 flex flex-col h-full">
              {/* header */}
              <div className="mb-6 sm:mb-8 space-y-3">
                <Skeleton className="h-8 w-3/4 sm:w-1/2 bg-gray-200 rounded-lg" />{" "}
                {/* title */}
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full sm:w-5/6 bg-gray-100 rounded" />{" "}
                  <Skeleton className="h-4 w-2/3 sm:w-3/4 bg-gray-100 rounded" />{" "}
                </div>
              </div>

              {/* menus */}
              <div className="flex flex-col gap-5 sm:gap-6 flex-1">
                {/* info cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  {/* card 1 */}
                  <div className="border border-gray-100 bg-[#FDFDFF] rounded-2xl p-5 flex flex-col gap-3">
                    <Skeleton className="w-10 h-10 rounded-full bg-gray-200" />{" "}
                    <div className="space-y-2">
                      <Skeleton className="h-6 w-24 bg-gray-200 rounded" />{" "}
                      <Skeleton className="h-4 w-32 bg-gray-100 rounded" />{" "}
                    </div>
                  </div>

                  {/* card 2 */}
                  <div className="border border-gray-100 bg-[#FDFDFF] rounded-2xl p-5 flex flex-col gap-3">
                    <Skeleton className="w-10 h-10 rounded-full bg-gray-200" />
                    <div className="space-y-2">
                      <Skeleton className="h-6 w-24 bg-gray-200 rounded" />
                      <Skeleton className="h-4 w-32 bg-gray-100 rounded" />
                    </div>
                  </div>
                </div>

                {/* Start Test Button Skeleton */}
                <div className="mt-0 pt-2 sm:pt-0">
                  <div className="w-full bg-gray-100 rounded-2xl p-6 sm:p-7 flex items-center gap-6">
                    <Skeleton className="w-12 h-12 sm:w-14 sm:h-16 rounded-xl bg-gray-200" />{" "}
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-6 w-32 bg-gray-200 rounded" />{" "}
                      <Skeleton className="h-4 w-48 bg-gray-200 rounded" />{" "}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Separator Mobile Skeleton */}
        <div className="lg:hidden px-4">
          <Separator className="bg-gray-100" />
        </div>

        {/* ========================================= */}
        {/* RIGHT SIDE                                */}
        {/* ========================================= */}
        <section className="w-full lg:w-[380px] flex-shrink-0">
          <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 flex flex-col h-[500px] lg:h-full lg:max-h-[calc(100vh-100px)]">
            {/* Header Riwayat Skeleton */}
            <div className="px-6 py-5 flex justify-between items-center bg-gray-50 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <Skeleton className="w-8 h-8 rounded-lg bg-gray-200" />{" "}
                {/* Icon History */}
                <div className="space-y-1.5">
                  <Skeleton className="h-5 w-20 bg-gray-200 rounded" />{" "}
                  <Skeleton className="h-3 w-28 bg-gray-200 rounded" />{" "}
                </div>
              </div>
              <Skeleton className="w-20 h-8 rounded-xl bg-gray-200" />{" "}
            </div>

            {/* list container */}
            <div className="flex-1 bg-[#FDFDFF] p-4 sm:p-5 space-y-3 overflow-hidden">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="flex items-center justify-between bg-white border border-gray-100 p-4 rounded-2xl"
                >
                  <div className="flex flex-col gap-2 w-full">
                    <div className="flex justify-between items-center w-full">
                      <Skeleton className="h-4 w-24 bg-gray-200 rounded" />
                      <Skeleton className="h-4 w-4 bg-gray-200 rounded-full sm:hidden" />{" "}
                    </div>
                    <Skeleton className="h-5 w-40 bg-gray-200 rounded" />
                    <Skeleton className="h-5 w-20 bg-gray-100 rounded-full mt-1" />
                  </div>
                  <Skeleton className="hidden sm:block w-8 h-8 rounded-full bg-gray-100 shrink-0 ml-4" />
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </ContentDrawer>
  );
};
