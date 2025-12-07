import React, { useEffect, useState } from "react";
import { useLocation, Link } from "react-router";
import { User, LogOut, Settings, Menu, Logs } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { SidebarContent } from "./SidebarContent";
import { useDashboardData } from "@/hooks/useDashboardData";

const TopNav = () => {
  const location = useLocation();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { data, isLoading } = useDashboardData();

  useEffect(() => {
    const handleScroll = () => {
      // smallest threesold
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  });

  const getPageTitle = (pathname) => {
    if (pathname.includes("/dashboard/pretest/quiz")) return "Quiz";
    if (pathname.includes("/dashboard/pretest")) return "Pretest";
    if (pathname.includes("/dashboard/account")) return "Akun Saya";
    if (pathname === "/dashboard") return "Dashboard";
    return "Dashboard";
  };

  const pageTitle = getPageTitle(location.pathname);

  return (
    <nav className="w-full px-4 md:px-8 py-4 md:py-6 flex justify-between items-center bg-gradient-to-b from-[#F5F5F5] to-transparent sticky top-0 z-40 transition-all duration-300">
      <div
        id="nav-floating-island"
        className={`w-full flex justify-between items-center py-3 md:py-4 rounded-3xl px-4 md:px-6 transition-all duration-300 ${
          isScrolled
            ? "bg-white/80 backdrop-blur-md shadow-sm"
            : "bg-white border-none border-gray-100"
        }`}
      >
        {/* left */}
        <section className="flex items-center gap-3">
          {/* burger */}
          <div className="lg:hidden">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <button className="p-2 -ml-1 text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
                  <Logs size={24} />
                </button>
              </SheetTrigger>
              <SheetContent
                side="left"
                className="p-0 w-[280px] border-r-0 bg-transparent"
              >
                <SheetTitle className="sr-only">Menu Navigasi</SheetTitle>
                <SheetDescription className="sr-only">
                  Navigasi utama aplikasi
                </SheetDescription>

                <SidebarContent
                  onItemClick={() => setIsMobileMenuOpen(false)}
                />
              </SheetContent>
            </Sheet>
          </div>

          {/* breadcrumb */}
          <h1 className="px-4 sm:px-4 md:px-6 py-1.5 md:py-2 rounded-full shadow-none bg-[#EEF2FF] text-[#4A3B80] font-bold text-[0.65rem] sm:text-xs md:text-sm border border-none transition-all truncate max-w-[150px] md:max-w-none">
            {pageTitle}
          </h1>
        </section>

        {/* right */}
        <section className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            onBlur={() => setTimeout(() => setIsDropdownOpen(false), 100)}
            className="flex items-center gap-2 md:gap-3 bg-white border border-gray-200 rounded-full md:rounded-2xl px-1 py-1 md:px-4 md:py-2 shadow-sm hover:bg-gray-50 transition-all focus:ring-2 focus:ring-purple-200 outline-none group"
            aria-haspopup="true"
            aria-expanded={isDropdownOpen}
          >
            <div className="w-8 h-8 bg-gray-100 overflow-hidden rounded-full flex items-center justify-center text-purple-700 group-hover:bg-gray-200 transition-colors">
              <img
                src="https://api.dicebear.com/9.x/notionists/svg?seed=Felix"
                alt="Foto Profil User"
                className="w-full h-full object-cover"
              />
            </div>
            {/* hide email */}
            <span className="hidden md:block text-sm text-gray-600 font-medium">
              user@gmail.com
            </span>
          </button>

          {/* dropdown menu */}
          <div
            onMouseDown={(e) => e.preventDefault()}
            className={`
            absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 p-2 z-50 transform transition-all duration-200 origin-top-right
            ${
              isDropdownOpen
                ? "opacity-100 scale-100 translate-y-0"
                : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
            }
          `}
          >
            {/* usr infos */}
            <div className="flex items-center gap-3 p-3 border-b border-gray-100 mb-2 bg-gray-50/50 rounded-t-lg">
              {/* ... */}
              <div className="overflow-hidden">
                {isLoading ? (
                  <>
                    <p className="text-sm font-bold text-gray-800 truncate">
                      ...
                    </p>
                    <p className="text-xs font-medium text-gray-500 truncate">
                      user@gmail.com
                    </p>
                  </>
                ) : (
                  <>
                    <p className="text-sm font-bold text-gray-800 truncate">
                      {data?.user?.name}
                    </p>
                    <p className="text-xs font-medium text-gray-500 truncate">
                      {data?.user?.email}
                    </p>
                  </>
                )}
              </div>
            </div>
            {/* menu items */}
            <ul className="flex flex-col gap-1">
              <li>
                <Link
                  to="/dashboard/account"
                  className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded-sm text-sm text-gray-700 font-medium transition-colors"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  <Settings size={16} className="text-gray-400" />
                  Account Settings
                </Link>
              </li>
              <li>
                <button
                  onClick={() => setIsDropdownOpen(false)}
                  className="w-full flex items-center gap-2 text-left px-3 py-2 hover:bg-red-50 rounded-sm text-sm text-red-500 font-medium transition-colors"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </li>
            </ul>
          </div>
        </section>
      </div>
    </nav>
  );
};

export default TopNav;
