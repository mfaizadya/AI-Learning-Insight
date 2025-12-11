import axiosClient from "@/api/axiosClient";

/**
 * Auth Service
 * Mengacu pada dokumentasi API Section: Authentication & User Management
 * Base URL: /api
 */
export const authService = {
  /**
   * Login User
   * Endpoint: POST /auth/login
   * @param {string} email
   * @param {string} password
   * @returns {Promise<Object>} Mengembalikan object { success, data: { token, user } }
   */
  async login(email, password) {
    const response = await axiosClient.post("/auth/login", {
      email,
      password,
    });
    return response.data;
  },

  /**
   * Register User Baru
   * Endpoint: POST /auth/register
   * @param {Object} userData - Payload { email, username, password, role? }
   * @returns {Promise<Object>} Mengembalikan object { success, data: { id, email, ... } }
   */
  async register(userData) {
    // userData harus berisi: email, username, password. (role opsional)
    const response = await axiosClient.post("/auth/register", userData);
    return response.data;
  },

  /**
   * Get Current User Profile
   * Endpoint: GET /users/profile
   * Note: Menggunakan endpoint /users/profile karena /auth/me tidak ada di docs.
   * Header Authorization di-handle otomatis oleh axiosClient interceptor.
   * @returns {Promise<Object>} Mengembalikan data profil user lengkap
   */
  async getProfile() {
    const response = await axiosClient.get("/users/profile");
    return response.data;
  },

  /**
   * Update Profile Picture
   * Endpoint: POST /users/profile/picture
   * Content-Type: multipart/form-data
   * @param {File} file - File gambar (JPEG, PNG, GIF, WebP) max 5MB
   */
  async uploadProfilePicture(file) {
    const formData = new FormData();
    formData.append("profilePicture", file); // Sesuai docs: field name 'profilePicture'

    const response = await axiosClient.post(
      "/users/profile/picture",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  },

  /**
   * Logout (Client Side Only)
   * Karena API menggunakan stateless JWT (tidak ada endpoint /auth/logout di docs),
   * kita cukup menghapus token di sisi client.
   */
  async logout() {
    // Tidak ada request ke backend
    return Promise.resolve(true);
  },
};
