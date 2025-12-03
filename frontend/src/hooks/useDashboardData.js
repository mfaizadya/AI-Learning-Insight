// src/hooks/useDashboardData.js
import { useState, useEffect } from "react";
import { dashboardService } from "@/services/DashboardService";

export const useDashboardData = () => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const result = await dashboardService.getDashboardData();
        setData(result);
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, isLoading, error };
};
