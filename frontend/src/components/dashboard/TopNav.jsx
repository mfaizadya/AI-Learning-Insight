import React, { useState } from "react";
import { useLocation, Link } from "react-router";
import { User, LogOut, Settings } from "lucide-react";

const TopNav = () => {
  const location = useLocation();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const getPageTitle = (pathname) => {
    if (pathname.includes("/dashboard/pretest")) return "Pretest";
    if (pathname.includes("/dashboard/account")) return "Akun Saya";
    if (pathname === "/dashboard") return "Dashboard";
    return "Dashboard";
  };

  const pageTitle = getPageTitle(location.pathname);

  return (
    <nav className="w-full px-8 py-6 flex justify-between items-center bg-transparent sticky top-0 z-20">
      {/* island/floating nav */}
      <div className="w-full flex justify-between items-center bg-white py-4 rounded-3xl px-6">
        <section aria-label="Breadcrumb">
          <h1 className="bg-white px-6 py-2 rounded-full shadow-sm text-gray-800 font-bold text-sm border border-gray-100 transition-all">
            {pageTitle}
          </h1>
        </section>
        <section className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            onBlur={() => setTimeout(() => setIsDropdownOpen(false), 200)}
            className="flex items-center gap-3 bg-white border border-gray-200 rounded-2xl px-4 py-2 shadow-sm hover:bg-gray-50 transition-all focus:ring-2 focus:ring-purple-200 outline-none group"
            aria-haspopup="true"
            aria-expanded={isDropdownOpen}
          >
            <div
              className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-700 group-hover:bg-purple-200 transition-colors"
              aria-hidden="true"
            >
              <User size={16} />
            </div>
            <span className="text-sm text-gray-600 font-medium">
              user@gmail.com
            </span>
          </button>

          {/* dropdown */}
          <div
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
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-700">
                <User size={16} />
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-bold text-gray-800 truncate">
                  User Name
                </p>
                <p className="text-xs font-medium text-gray-500 truncate">
                  user@gmail.com
                </p>
              </div>
            </div>

            {/* menu items */}
            <ul className="flex flex-col gap-1">
              <li>
                <Link
                  to="/dashboard/account"
                  className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded-lg text-sm text-gray-700 font-medium transition-colors"
                >
                  <Settings size={16} className="text-gray-400" />
                  Account Settings
                </Link>
              </li>
              <li>
                <button className="w-full flex items-center gap-2 text-left px-3 py-2 hover:bg-red-50 rounded-lg text-sm text-red-500 font-medium transition-colors">
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
