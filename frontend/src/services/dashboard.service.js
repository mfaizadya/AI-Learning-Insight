import { resultService } from "./result.service";

const dashboardService = {
  getLastTestResult: async () => {
    try {
      const response = await resultService.getHistory();
      const dataArray = response.data.data || response.data;

      if (Array.isArray(dataArray) && dataArray.length > 0) {
        const lastItem = dataArray[0];  
        return { success: true, data: lastItem };
      }

      return { success: false, data: null, message: "No test results found." };
    } catch (error) {
      throw error;
    }
  },
};

export default dashboardService;
