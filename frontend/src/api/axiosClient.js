import axios from "axios";
import { storage } from "@/utils/storage";

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 60000,
});

// req interceptor
axiosClient.interceptors.request.use(
  (config) => {
    const token = storage.getToken();
    // console.log("Interceptor Running!");
    // console.log("Token found:", token);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// res interceptor
axiosClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // unauth
    if (error.response && error.response.status === 401) {
      storage.clearSession();

      // if (window.location.pathname !== "/auth/login") {
      //   window.location.href = "/auth/login";
      // }
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
