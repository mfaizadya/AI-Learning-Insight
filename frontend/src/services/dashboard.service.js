import axiosClient from "@/api/axiosClient";

export const dashboardService = {
  getDashboardData: async () => {
    const response = await axiosClient.get("/dashboard/summary");
    return response.data.data;
  },

  getWeeklyProgress: async () => {
    const response = await axiosClient.get("/dashboard/progress");
    return response.data.data;
  },
};
