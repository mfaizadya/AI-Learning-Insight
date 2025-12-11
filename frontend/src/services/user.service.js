import axiosClient from "@/api/axiosClient";

export const userService = {
  getProfile: async () => {
    const response = await axiosClient.get("/users/profile");
    return response.data.data;
  },

  uploadProfilePicture: async (file) => {
    const formData = new FormData();
    formData.append("profilePicture", file);

    const response = await axiosClient.post(
      "/users/profile/picture",
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );

    return response.data.data;
  },
};
