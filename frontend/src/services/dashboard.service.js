import axiosClient from "@/api/axiosClient";

export const dashboardService = {
  // Mengambil SEMUA data yang dibutuhkan halaman dashboard dalam satu request
  // (User info, learning style, stats, quote, dll)
  getDashboardData: async () => {
    const response = await axiosClient.get("/dashboard/summary");
    return response.data.data;
  },

  // Contoh lain yang spesifik Dashboard
  getWeeklyProgress: async () => {
    const response = await axiosClient.get("/dashboard/progress");
    return response.data.data;
  },
};
