import axiosClient from "@/api/axiosClient";

export const userService = {
  updateProfile: async (data) => {
    const response = await axiosClient.put("/users/profile", data);
    return response.data;
  },

  changePassword: async (data) => {
    const response = await axiosClient.put("/users/profile/password", data);
    return response.data;
  },
};
