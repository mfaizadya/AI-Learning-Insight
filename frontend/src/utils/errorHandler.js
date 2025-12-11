export const getErrorMessage = (error) => {
  if (error.code === "ERR_NETWORK" || error.message === "Network Error") {
    return "Gagal terhubung ke server. Periksa koneksi internet Anda.";
  }

  if (error.response) {
    const status = error.response.status;
    const data = error.response.data; // { success, error, details }

    // 409: Conflict (Register - Email Duplicate)
    if (status === 409) {
      return "Email ini sudah terdaftar. Silakan login menggunakan akun tersebut.";
    }

    // 401: Unauthorized (Login - Salah Password/Email)
    if (status === 401) {
      return "Email atau password yang Anda masukkan salah.";
    }

    // 403: Forbidden (Role tidak sesuai)
    if (status === 403) {
      return "Anda tidak memiliki akses ke halaman ini.";
    }

    if (status === 400 && data.details && data.details.length > 0) {
      return data.details[0];
    }

    if (data.error) {
      if (data.error === "Password weak") {
        return "Password terlalu lemah (minimal 8 karakter).";
      }

      return data.error;
    }
  }

  //   last fallback
  return "Terjadi kesalahan sistem. Silakan coba beberapa saat lagi.";
};
