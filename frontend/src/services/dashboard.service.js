import axiosClient from "../api/axiosClient";

const dashboardService = {
  getDashboardAggregatedData: async () => {
    try {
      const response = await axiosClient.get("/dashboard");
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default dashboardService;
