import ContentDrawer from "../reusable/ContentDrawer";
import { Skeleton } from "../ui/skeleton";

export const AccountPageSkeleton = () => {
  return (
    <ContentDrawer>
      <section className="flex-1 flex flex-col gap-6 min-w-0">
        <article className="bg-white border border-gray-100 rounded-3xl p-1 shadow-sm flex flex-col h-full">
          <div className="flex flex-col h-full relative">
            <Skeleton className="h-32 w-full rounded-t-[1.3rem] bg-gray-200" />
            <div className="px-8 pb-8 flex flex-col flex-1">
              <div className="relative -mt-12 mb-6">
                <Skeleton className="w-28 h-28 rounded-full border-4 border-white bg-gray-200" />
              </div>
              <div className="mb-6 space-y-2">
                <Skeleton className="h-8 w-48 bg-gray-200" />
                <Skeleton className="h-4 w-72 bg-gray-100" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* field 1 */}
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24 bg-gray-200" />
                  <Skeleton className="h-12 w-full rounded-xl bg-gray-100" />{" "}
                </div>
                {/* field 2 */}
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24 bg-gray-200" />
                  <Skeleton className="h-12 w-full rounded-xl bg-gray-100" />
                </div>
                {/* field 3 */}
                <div className="space-y-2 md:col-span-2">
                  <Skeleton className="h-4 w-24 bg-gray-200" />
                  <Skeleton className="h-12 w-full rounded-xl bg-gray-100" />
                  <Skeleton className="h-3 w-64 mt-1 bg-gray-50" />{" "}
                </div>
              </div>
              {/* btn */}
              <Skeleton className="hidden md:block w-2/5 h-12 mt-10 rounded-xl bg-gray-200" />
            </div>
          </div>
        </article>
      </section>
      {/* right side */}
      <section className="w-full lg:w-[350px] flex-shrink-0 flex flex-col gap-6">
        {/* info card */}
        <div className="bg-white rounded-3xl p-1 border border-gray-100 h-64">
          <div className="p-6 space-y-4">
            <Skeleton className="h-6 w-32 bg-gray-200" />
            <div className="space-y-4 pt-2">
              <Skeleton className="h-16 w-full rounded-2xl bg-gray-50" />
              <Skeleton className="h-16 w-full rounded-2xl bg-gray-50" />
            </div>
          </div>
        </div>

        {/* sec card */}
        <div className="bg-white rounded-3xl p-1 border border-gray-100 h-40">
          <div className="p-6 space-y-4">
            <Skeleton className="h-6 w-32 bg-gray-200" />
            <Skeleton className="h-10 w-full rounded-xl bg-gray-50" />
          </div>
        </div>
      </section>
    </ContentDrawer>
  );
};
