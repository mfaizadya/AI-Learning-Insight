import { useState, useEffect } from "react";
import dashboardService from "@/services/dashboard.service";

export const useLastTestResult = () => {
  const [lastResult, setLastResult] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLastResult = async () => {
      try {
        const response = await dashboardService.getLastTestResult();

        if (response.success && response.data) {
          setLastResult(response.data);
        } else {
          setLastResult(null);
        }
      } catch (err) {
        console.error("Gagal mengambil hasil tes terakhir:", err);
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLastResult();
  }, []);

  return { lastResult, isLoading, error };
};
