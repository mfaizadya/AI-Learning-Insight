import React, { useState } from "react";
import ContentDrawer from "@/components/reusable/ContentDrawer";
import {
  User,
  Mail,
  Calendar,
  Save,
  Shield,
  //   Camera,
  AtSign,
  LogOut,
  //   MapPin,
  //   Info,
} from "lucide-react";

// Mock Data (Simulasi data dari Backend)
const USER_DATA = {
  fullName: "John Doe",
  username: "johndoe123",
  email: "user@gmail.com",
  joinDate: "12 Oktober 2025",
  location: "Jakarta, Indonesia",
  bio: "Mahasiswa Teknik Informatika yang antusias mempelajari AI dan Web Development.",
  role: "Student",
};

export default function AccountPage() {
  // State untuk form handling
  const [formData, setFormData] = useState({
    fullName: USER_DATA.fullName,
    username: USER_DATA.username,
    bio: USER_DATA.bio,
    location: USER_DATA.location,
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulasi API Call
    setTimeout(() => {
      setIsLoading(false);
      alert("Perubahan profil berhasil disimpan!");
    }, 1000);
  };

  return (
    <ContentDrawer>
      {/* left side */}
      <section className="flex-1 flex flex-col gap-6 min-w-0">
        <article className="bg-white border border-gray-100 rounded-3xl p-1 shadow-sm flex flex-col h-full">
          <div className="flex flex-col h-full relative">
            {/* bg */}
            <div className="h-32 bg-gradient-to-r from-[#3F3370] to-[#6854a8] rounded-t-[1.3rem] relative overflow-hidden">
              <div className="absolute top-0 right-0 p-32 bg-white/5 rounded-full blur-3xl transform translate-x-10 -translate-y-10"></div>
            </div>

            <div className="px-8 pb-8 flex flex-col flex-1">
              <div className="relative -mt-12 mb-6 flex justify-between items-end">
                {/* pp */}
                <div className="relative group">
                  <div className="w-28 h-28 rounded-full border-4 border-white bg-gray-200 overflow-hidden shadow-md">
                    {/* Placeholder Avatar */}
                    <img
                      src="https://api.dicebear.com/9.x/notionists/svg?seed=Felix"
                      alt="Avatar"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {/* <button
                    className="absolute bottom-[-0.5rem] right-[-0.5rem] bg-white text-primary p-2 rounded-xl shadow-sm border border-gray-100 hover:bg-gray-50 transition-colors"
                    title="Ganti Foto Profil"
                  >
                    <Camera size={18} />
                  </button> */}
                </div>
              </div>
              {/* form */}
              <header className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Pengaturan Profil
                </h2>
                <p className="text-gray-500 text-sm mt-1">
                  Kelola informasi pribadi dan tampilan profil akun Anda.
                </p>
              </header>
              <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* username */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <User size={16} className="text-primary" /> Nama Lengkap
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl bg-[#FDFDFF] border border-gray-200 text-gray-800 font-medium focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all placeholder:text-gray-400"
                    placeholder="Masukkan nama lengkap"
                  />
                </div>
                {/* username */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <AtSign size={16} className="text-primary" /> Username
                  </label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl bg-[#FDFDFF] border border-gray-200 text-gray-800 font-medium focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all placeholder:text-gray-400"
                    placeholder="Username unik"
                  />
                </div>
                {/* email */}
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <Mail size={16} className="text-gray-400" /> Email
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      value={USER_DATA.email}
                      disabled
                      className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-500 font-medium cursor-not-allowed select-none"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400 bg-gray-100 px-2 py-1 rounded-md border border-gray-200">
                      Tidak dapat diubah
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-400 ml-1">
                    Hubungi administrator jika Anda perlu mengubah alamat email.
                  </p>
                </div>

                {/* Location */}
                {/* <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <MapPin size={16} className="text-primary" /> Lokasi
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl bg-[#FDFDFF] border border-gray-200 text-gray-800 font-medium focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all placeholder:text-gray-400"
                    placeholder="Kota, Negara"
                  />
                </div> */}

                {/* Bio */}
                {/* <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <Info size={16} className="text-primary" /> Bio Singkat
                  </label>
                  <textarea
                    name="bio"
                    rows={4}
                    value={formData.bio}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl bg-[#FDFDFF] border border-gray-200 text-gray-800 font-medium focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all placeholder:text-gray-400 resize-none"
                    placeholder="Ceritakan sedikit tentang dirimu..."
                  />
                </div> */}
              </form>

              {/* mobile */}
              <button
                onClick={handleSave}
                className="mt-8 md:hidden w-full flex justify-center items-center gap-2 bg-primary hover:bg-[#2e2555] text-white px-6 py-3 rounded-xl font-bold text-sm shadow-md transition-all active:scale-95"
              >
                <Save size={18} /> Simpan Perubahan
              </button>

              {/* desktop */}
              <button
                onClick={handleSave}
                disabled={isLoading}
                className="hidden w-2/5 md:flex items-center justify-center gap-2 bg-primary hover:bg-[#2e2555] text-white px-6 py-4 rounded-xl font-medium text-sm shadow-md shadow-purple-900/10 transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed mt-10"
              >
                {isLoading ? (
                  "Menyimpan..."
                ) : (
                  <>
                    <Save size={18} /> Simpan Perubahan
                  </>
                )}
              </button>
            </div>
          </div>
        </article>
      </section>

      {/* right side */}
      <section className="w-full lg:w-[350px] flex-shrink-0 flex flex-col gap-6">
        {/* card 1 */}
        <section className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm p-1">
          <div className="bg-[#FDFDFF] p-6 rounded-[1.3rem] border border-gray-50 h-full flex flex-col gap-5">
            <header>
              <h3 className="font-bold text-gray-800 text-lg">
                Informasi Akun
              </h3>
              <p className="text-xs text-gray-400">Detail keanggotaan Anda</p>
            </header>

            <div className="space-y-4">
              <div className="flex items-center gap-4 p-3 bg-white rounded-2xl border border-gray-100 shadow-sm">
                <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-primary">
                  <Calendar size={18} />
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-medium">
                    Bergabung sejak
                  </p>
                  <p className="text-sm font-bold text-gray-800">
                    {USER_DATA.joinDate}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-3 bg-white rounded-2xl border border-gray-100 shadow-sm">
                <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-primary">
                  <Shield size={18} />
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-medium">
                    Status Akun
                  </p>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                    <p className="text-sm font-bold text-gray-800">
                      Aktif • {USER_DATA.role}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* card 2 */}
        <section className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm p-1">
          <div className="p-6 rounded-[1.3rem] h-full flex flex-col gap-4">
            <h3 className="font-bold text-gray-800 text-lg">Keamanan</h3>

            <button className="w-full text-left flex items-center justify-between p-4 rounded-2xl border border-gray-200 hover:border-primary hover:bg-secondary/30 transition-all group">
              <span className="text-sm font-semibold text-gray-600 group-hover:text-primary">
                Ganti Password
              </span>
              <span className="text-gray-400 group-hover:translate-x-1 transition-transform">
                &gt;
              </span>
            </button>

            <div className="h-px bg-gray-100 my-1"></div>

            <button className="w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 border border-red-100 transition-colors font-bold text-sm">
              <LogOut size={16} /> Keluar Akun
            </button>
          </div>
        </section>
      </section>
    </ContentDrawer>
  );
}
