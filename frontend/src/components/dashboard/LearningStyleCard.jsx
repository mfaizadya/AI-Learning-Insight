import { AlertCircle, Ear, Eye, Hand } from "lucide-react";
import { Card, CardContent } from "../ui/card";

// Helper function untuk ikon (tidak berubah, styling tetap sama)
const getStyleIcon = (styleType) => {
  if (!styleType || styleType === "Belum Tes") {
    return (
      <AlertCircle
        className="h-16 w-16 sm:h-16 sm:w-16 text-primary"
        strokeWidth={1.5}
      />
    );
  }

  const lowerType = styleType.toLowerCase();

  if (lowerType.includes("visual")) {
    return (
      <Eye
        className="h-16 w-16 sm:h-16 sm:w-16 text-primary"
        strokeWidth={1.5}
      />
    );
  }
  if (lowerType.includes("auditori")) {
    return (
      <Ear
        className="h-16 w-16 sm:h-16 sm:w-16 text-primary"
        strokeWidth={1.5}
      />
    );
  }
  if (lowerType.includes("kinestetik")) {
    return (
      <Hand
        className="h-16 w-16 sm:h-16 sm:w-16 text-primary"
        strokeWidth={1.5}
      />
    );
  }

  return (
    <Eye className="h-16 w-16 sm:h-16 sm:w-16 text-primary" strokeWidth={1.5} />
  );
};

export const LearningStyleCard = ({ styleData, className = "", ...props }) => {
  // 1. Ambil data langsung dari props (styleData), bukan fetch ulang
  const styleType = styleData?.type || "Belum Tes";
  // Asumsi styleData.percentage ada (sesuai struktur dashboardController)
  const score = styleData?.percentage || 0;

  // 2. Tentukan tampilan berdasarkan data prop
  const displayIcon = getStyleIcon(styleType);

  const displayText =
    styleType === "Belum Tes" ? "Lakukan Tes Gaya" : `${styleType} (${score}%)`;

  // 3. Styling Logic (Dipertahankan)
  // Jika "Belum Tes", background abu-abu. Jika sudah, background secondary (ungu muda/sesuai tema).
  const cardClass =
    styleType === "Belum Tes"
      ? "bg-secondary"
      : "bg-secondary";

  return (
    <Card
      className={`${cardClass} shadow-sm transition-all duration-300 border-none hover:ring-primary hover:ring-1 sm:hover:ring-2 rounded-2xl overflow-hidden flex flex-col h-full ${className}`}
      {...props}
    >
      <CardContent className="pt-0 px-0 pb-0 flex flex-col justify-between h-full">
        {/* Bagian Atas: Label & Ikon */}
        <div className="flex items-center justify-between p-6 px-12 sm:px-11 mt-2">
          <h3 className="text-primary text-xl sm:text-[1.35rem] font-medium leading-tight">
            Gaya <br /> belajarmu:
          </h3>
          {displayIcon}
        </div>

        {/* Bagian Bawah: Badge Hasil */}
        <div className="w-3/4 sm:w-3/4 mx-auto bg-primary text-white p-3 sm:py-4 sm:px-4 rounded-t-2xl sm:rounded-t-3xl text-center text-base sm:text-lg font-semibold shadow-[0_-4px_6px_-1px_rgba(63,51,112,0.1)] cursor-default flex items-center justify-center">
          {displayText}
        </div>
      </CardContent>
    </Card>
  );
};
