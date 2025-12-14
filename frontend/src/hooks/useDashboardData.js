import { useState, useEffect } from "react";
import dashboardService from "@/services/dashboard.service";

export const useDashboardData = () => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await dashboardService.getDashboardAggregatedData();
        if (response.success && response.data) {
          setData(response.data);
        } else {
          setError(new Error("Data dashboard tidak ditemukan."));
        }
      } catch (err) {
        console.error(err);
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, isLoading, error };
};
