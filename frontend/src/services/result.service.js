import axiosClient from "../api/axiosClient";

const ENDPOINT = "/results";

export const resultService = {
  /**
   * Method: GET /api/results/history
   */
  getHistory: async () => {
    try {
      const response = await axiosClient.get(`${ENDPOINT}/history`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Method: GET /api/results/history/:id
   */
  getHistoryDetail: async (id) => {
    try {
      const response = await axiosClient.get(`${ENDPOINT}/history/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
