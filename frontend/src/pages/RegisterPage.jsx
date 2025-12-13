import React, { useState } from "react";
import { useNavigate, Link } from "react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, User, Mail, Lock, Loader2, Sparkles } from "lucide-react";
import { authService } from "@/services/auth.service";
import { getErrorMessage } from "@/utils/errorHandler";
import { AuthHeaderTitle } from "@/components/reusable/AuthHeaderTittle";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      await authService.register({
        email: formData.email,
        username: formData.name,
        password: formData.password,
        role: "user",
      });

      navigate("/", {
        state: { message: "Registrasi berhasil! Silakan login." },
      });
    } catch (err) {
      const message = getErrorMessage(err);
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full sm:min-h-screen flex w-full font-sans bg-[#F8F9FC]">
      {/* left */}
      <div className="hidden lg:flex w-1/2 bg-[#3b2f6e] relative overflow-hidden flex-col justify-between p-12 text-white">
        {/* <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div> */}
        {/* <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#5D4E98] rounded-full blur-[100px] opacity-50"></div> */}
        {/* <div className="absolute bottom-0 left-0 w-full h-64 bg-gradient-to-t from-[#2e2555] to-transparent opacity-80"></div> */}

        {/* Content */}
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-8 opacity-80">
            <Sparkles size={20} />
            <span className="text-sm sm:text-lg font-semibold">
              CerdasKu - AI Learning Insight
            </span>
          </div>
          <h1 className="text-[2.6rem] font-bold leading-tight mb-6 tracking-tight">
            Kenali Cara <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-200 to-pink-200">
              Belajarmu Disini!
            </span>
          </h1>
          <p className="text-lg text-purple-100/80 leading-relaxed max-w-md">
            Mulai asesmen berbasis AI untuk memetakan dimensi kognitifmu.
            Dapatkan laporan instan mengenai gaya dan pola belajar, serta
            strategi konkret untuk memaksimalkan efisiensi belajar.
          </p>
        </div>

        {/* Footer Text */}
        <div className="relative z-10 text-sm text-purple-200/60">
          © 2025 AI Learning Insight. All rights reserved.
        </div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-purple-600 rounded-full blur-3xl opacity-20 pointer-events-none"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600 rounded-full blur-3xl opacity-10 pointer-events-none"></div>
      </div>

      {/* right */}
      <div className="flex-1 flex items-center justify-center p-0 sm:p-14 max-sm:pb-10">
        <div className="w-full max-w-[470px] xl:max-w-[490px] 2xl:max-w-[520px] space-y-8">
          {/* Header Mobile Only */}
          <AuthHeaderTitle />

          <div className="sm:bg-white p-8 max-sm:pb-3 max-sm:pt-5 sm:p-9 rounded-3xl sm:shadow-sm sm:border sm:border-gray-100">
            <div className="mb-8">
              <h2 className="text-xl sm:text-[1.35rem] font-bold text-gray-900 tracking-tight">
                Daftar Akun
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 mt-2">
                Lengkapi data diri kamu terlebih dahulu, untuk mengakses AI
                Learning Insight dari CerdasKu.
              </p>
            </div>

            {/* Error Alert */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3 text-red-600 animate-in slide-in-from-top-2">
                <AlertCircle size={20} className="shrink-0 mt-0.5" />
                <span className="text-sm font-medium">{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name Input */}
              <div className="space-y-2">
                <Label
                  htmlFor="name"
                  className="text-sm font-semibold text-gray-700 ml-1"
                >
                  Username
                </Label>
                <div className="relative group">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#3F3370] transition-colors">
                    <User size={18} />
                  </div>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Contoh: Budi Santoso"
                    value={formData.name}
                    onChange={handleChange}
                    className="pl-10 h-12 text-sm sm:text-base bg-gray-50 border-gray-200 focus:bg-white focus:border-[#3F3370] focus:ring-[#3F3370]/20 rounded-xl transition-all"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Email Input */}
              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-sm font-semibold text-gray-700 ml-1"
                >
                  Alamat Email
                </Label>
                <div className="relative group">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#3F3370] transition-colors">
                    <Mail size={18} />
                  </div>
                  <Input
                    id="email"
                    type="email"
                    placeholder="nama@email.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="pl-10 h-12 text-sm sm:text-base bg-gray-50 border-gray-200 focus:bg-white focus:border-[#3F3370] focus:ring-[#3F3370]/20 rounded-xl transition-all"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <Label
                  htmlFor="password"
                  className="text-sm font-semibold text-gray-700 ml-1"
                >
                  Password
                </Label>
                <div className="relative group">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#3F3370] transition-colors">
                    <Lock size={18} />
                  </div>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    className="pl-10 h-12 text-sm sm:text-base bg-gray-50 border-gray-200 focus:bg-white focus:border-[#3F3370] focus:ring-[#3F3370]/20 rounded-xl transition-all"
                    required
                    disabled={isLoading}
                    minLength={7}
                  />
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 bg-[#3F3370] hover:bg-[#2e2555] text-white font-bold rounded-xl text-base shadow-lg shadow-purple-900/20 hover:shadow-purple-900/30 transition-all active:scale-[0.98] mt-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Mendaftarkan...
                  </>
                ) : (
                  "Buat Akun"
                )}
              </Button>
            </form>
          </div>

          <p className="text-center text-gray-500 text-sm">
            Sudah punya akun?{" "}
            <Link
              to="/auth/login"
              className="font-bold text-[#3F3370] hover:text-[#2e2555] hover:underline underline-offset-4 transition-all"
            >
              Masuk disini
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
