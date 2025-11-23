import ContentDrawer from "@/components/reusable/ContentDrawer";
import { ClipboardCheck, Info } from "lucide-react";
import { Link } from "react-router";

export default function QuizPage() {
  return (
    <>
      <ContentDrawer>
        <section className="flex-1 flex flex-col gap-6 w-[65%]">
          <article className="bg-white border border-gray-100 rounded-3xl p-1 shadow-sm flex flex-col">
            <div className="p-6 flex flex-col h-full">
              {/* header */}
              <header className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit...
                </h2>
                <p className="text-gray-500 text-sm leading-relaxed max-w-md">
                  Dengan mengisi serangkaian pertanyaan untuk mendapatkan
                  Insight
                </p>
              </header>
            </div>
          </article>
        </section>
        <section className="flex-1 flex flex-col gap-6 w-[35%]">
          <article className="bg-white border border-gray-100 rounded-3xl p-1 shadow-sm flex flex-col">
            <div className="p-6 flex flex-col h-full">
              {/* header */}
              <header className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Ketahui Pola Belajarmu!
                </h2>
                <p className="text-gray-500 text-sm leading-relaxed max-w-md">
                  Dengan mengisi serangkaian pertanyaan untuk mendapatkan
                  Insight
                </p>
              </header>
            </div>
          </article>
        </section>
      </ContentDrawer>
    </>
  );
}
