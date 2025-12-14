import axiosClient from "@/api/axiosClient";

const testService = {
  // ==========================================
  // Learn pattern (Questions 1-9)
  // ==========================================

  /**
   * GET /tests/pola
   */
  getPolaTests: async () => {
    try {
      const response = await axiosClient.get("/tests/pola");
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * GET /tests/pola/:id
   */
  getPolaTestDetail: async (id) => {
    try {
      const response = await axiosClient.get(`/tests/pola/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * submit
   * POST /results/pola
   */
  submitPolaResult: async (payload) => {
    try {
      // payload: { test_id: 1, answers: [...] }
      const response = await axiosClient.post("/results/pola", payload);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // ==========================================
  // Learning style (Questions 10-15)
  // ==========================================

  /**
   * GET /tests/gaya
   */
  getGayaTests: async () => {
    try {
      const response = await axiosClient.get("/tests/gaya");
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * GET /tests/gaya/:id
   */
  getGayaTestDetail: async (id) => {
    try {
      const response = await axiosClient.get(`/tests/gaya/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * submit
   * POST /results/gaya
   */
  submitGayaResult: async (payload) => {
    try {
      // payload: { test_id: 1, answers: [...] }
      const response = await axiosClient.post("/results/gaya", payload);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // ==========================================
  // 3. HISTORY & UTILS
  // ==========================================

  /**
   * GET /results/history
   */
  getHistory: async () => {
    try {
      const response = await axiosClient.get("/results/history");
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * helper, merging 2 in 1
   */
  getFullTestPackage: async (polaId = 1, gayaId = 1) => {
    try {
      // run async
      const [polaRes, gayaRes] = await Promise.all([
        axiosClient.get(`/tests/pola/${polaId}`),
        axiosClient.get(`/tests/gaya/${gayaId}`),
      ]);

      return {
        pola: polaRes.data.data,
        gaya: gayaRes.data.data,
      };
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

export default testService;
