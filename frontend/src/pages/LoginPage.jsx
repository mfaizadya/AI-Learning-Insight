import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router";
import {
  Mail,
  Lock,
  Loader2,
  Sparkles,
  LogIn,
  AlertCircle,
  CheckCircle2,
  ShieldCheck,
} from "lucide-react";
import { authService } from "@/services/auth.service";
import { useAuth } from "@/context/AuthContext";
import { getErrorMessage } from "@/utils/errorHandler";
import { AuthHeaderTitle } from "@/components/reusable/AuthHeaderTittle";
import { useToast } from "@/hooks/use-toast";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // State Management
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  // const [error, setError] = useState(""); // Hapus state error lokal (diganti toast)
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // call service api
      const response = await authService.login(
        formData.email,
        formData.password
      );

      if (response.success && response.data) {
        // save token
        login(response.data.user, response.data.token);

        toast({
          title: "Login Berhasil",
          description: `Selamat datang kembali, ${
            response.data.user.name || "User"
          }!`,
          className: "bg-green-50 border-green-200 text-green-800",
          action: <CheckCircle2 className="h-5 w-5 text-green-600" />,
          duration: 3000,
        });

        navigate("/dashboard", { replace: true });
      } else {
        throw new Error("Gagal login. Silakan coba lagi.");
      }
    } catch (err) {
      console.log("Login Error:", err);
      const message = getErrorMessage(err);

      toast({
        variant: "destructive",
        title: "Gagal Masuk",
        description: message,
        action: <AlertCircle className="h-5 w-5" />,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full sm:min-h-screen flex w-full font-sans bg-[#F8F9FC]">
      {/* left - Tetap Sama */}
      <div className="hidden lg:flex w-1/2 bg-[#3b2f6e] relative overflow-hidden flex-col justify-between p-12 text-white">
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-purple-600 rounded-full blur-3xl opacity-20 pointer-events-none"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600 rounded-full blur-3xl opacity-10 pointer-events-none"></div>

        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-8 opacity-80">
            <Sparkles size={20} />
            <span className="text-sm sm:text-lg font-semibold">
              CerdasKu - AI Learning Insight
            </span>
          </div>

          <h1 className="text-[2.6rem] font-bold leading-tight mb-6 tracking-tight">
            Selamat Datang <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-200 to-pink-200">
              Kembali!
            </span>
          </h1>

          <p className="text-lg text-purple-100/80 leading-relaxed max-w-md">
            Lanjutkan perjalanan belajarmu. Pantau perkembangan analisis pola &
            gaya belajar kamu, dan juga akses rekomendasi terbaru yang relevan.
          </p>
        </div>

        <div className="relative z-10 text-sm text-purple-200/60">
          © 2025 CerdasKu. All rights reserved.
        </div>
      </div>

      {/* right */}
      <div className="flex-1 flex items-center justify-center p-0 sm:p-14">
        <div className="w-full max-w-[470px] xl:max-w-[470px] 2xl:max-w-[520px] space-y-8 max-sm:h-dvh">
          {/* mobile header */}
          <AuthHeaderTitle />

          <div className="sm:bg-white p-8 pt-7 max-sm:pb-3 sm:p-9 rounded-3xl sm:shadow-sm sm:border border-gray-100">
            <div className="mb-8">
              <h2 className="text-xl sm:text-[1.35rem] font-bold text-gray-900 tracking-tight flex items-center gap-2">
                Masuk Akun
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 mt-2">
                Masukkan email dan password untuk mengakses dashboard.
              </p>
            </div>

            {/* ERROR ALERT BOX DIHAPUS (Digantikan Toast) */}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email Input */}
              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-sm font-semibold text-gray-700 ml-1"
                >
                  Email
                </Label>
                <div className="relative group">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#3b2f6e] transition-colors">
                    <Mail size={18} />
                  </div>
                  <Input
                    id="email"
                    type="email"
                    name="email"
                    placeholder="exammple@email.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="pl-10 h-12 text-sm sm:text-base bg-gray-50 border-gray-200 focus:bg-white focus:border-[#3b2f6e] focus:ring-[#3b2f6e]/20 rounded-xl transition-all"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label
                    htmlFor="password"
                    className="text-sm font-semibold text-gray-700 ml-1"
                  >
                    Password
                  </Label>
                  {/*  */}
                </div>
                <div className="relative group">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#3b2f6e] transition-colors">
                    <Lock size={18} />
                  </div>
                  <Input
                    id="password"
                    type="password"
                    name="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    className="pl-10 h-12 text-sm sm:text-base bg-gray-50 border-gray-200 focus:bg-white focus:border-[#3b2f6e] focus:ring-[#3b2f6e]/20 rounded-xl transition-all"
                    required
                    disabled={isLoading}
                  />
                </div>
                <div className="flex justify-end">
                  <Link
                    to="#"
                    className="text-xs mt-1 right-0 text-[#3b2f6e] hover:underline font-medium opacity-80 hover:opacity-100"
                  >
                    Lupa Password?
                  </Link>
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 bg-[#3b2f6e] hover:bg-[#2e2555] text-white font-bold rounded-xl text-base shadow-lg shadow-purple-900/20 hover:shadow-purple-900/30 transition-all active:scale-[0.98] mt-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Memproses...
                  </>
                ) : (
                  <div className="flex items-center gap-2">
                    Masuk <LogIn size={18} />
                  </div>
                )}
              </Button>
            </form>
          </div>

          <p className="text-center text-gray-500 text-sm">
            Belum punya akun?{" "}
            <Link
              to="/auth/register"
              className="font-bold text-[#3b2f6e] hover:text-[#2e2555] hover:underline underline-offset-4 transition-all"
            >
              Daftar disini
            </Link>
          </p>

          {/* Demo Admin Card - Jury/Reviewer Access */}
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
            <div className="mx-auto w-full rounded-2xl border border-dashed border-indigo-200 bg-indigo-50/50 p-4 sm:p-5 hover:bg-indigo-50 transition-colors">
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="flex-shrink-0 rounded-xl bg-white p-2.5 text-indigo-600 shadow-sm border border-indigo-100">
                  <ShieldCheck size={20} />
                </div>
                <div className="flex-1 space-y-3">
                  <div>
                    <h3 className="text-sm font-bold text-indigo-950 flex items-center gap-2">
                      Akses Demo Juri / Penilai
                      <span className="hidden sm:inline-flex px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 text-[10px] font-extrabold uppercase tracking-wider">
                        Admin Mode
                      </span>
                    </h3>
                    <p className="text-xs text-indigo-900/70 leading-relaxed mt-1.5">
                      Gunakan kredensial pengujian berikut untuk mengakses dashboard administratif dan fitur manajemen penuh.
                    </p>
                  </div>

                  <div className="grid gap-2 text-xs sm:text-sm bg-white rounded-xl p-3 border border-indigo-100/80 shadow-sm">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4">
                      <span className="text-[10px] sm:text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Email
                      </span>
                      <div className="flex items-center gap-2">
                        <code className="font-mono text-indigo-700 font-bold bg-indigo-50/80 px-2 py-1 rounded-md select-all cursor-pointer hover:bg-indigo-100 transition-colors">
                          admin@cerdasku.id
                        </code>
                      </div>
                    </div>
                    <div className="h-px bg-gray-100 w-full"></div>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4">
                      <span className="text-[10px] sm:text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Password
                      </span>
                      <div className="flex items-center gap-2">
                        <code className="font-mono text-indigo-700 font-bold bg-indigo-50/80 px-2 py-1 rounded-md select-all cursor-pointer hover:bg-indigo-100 transition-colors">
                          admin123
                        </code>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
